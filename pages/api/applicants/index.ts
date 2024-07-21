import { NextApiRequest, NextApiResponse } from "next";
import { createApplicant, getApplicants } from "../../../lib/mongo/applicants";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getPeriodById } from "../../../lib/mongo/periods";
import { isApplicantType } from "../../../lib/utils/validators";
import { isAdmin, hasSession, checkOwId } from "../../../lib/utils/apiChecks";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!hasSession(res, session)) return;

  try {
    if (req.method === "GET") {
      if (!isAdmin(res, session)) return;

      const { applicants, error } = await getApplicants();
      if (error) throw new Error(error);
      return res.status(200).json({ applicants });
    }

    if (req.method === "POST") {
      const requestBody = req.body;
      requestBody.date = new Date(new Date().getTime() + 60 * 60 * 2000); // add date with norwegain time (GMT+2)

      if (!isApplicantType(req.body)) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      if (!checkOwId(res, session, requestBody.owId)) return;

      const { period } = await getPeriodById(String(requestBody.periodId));

      if (!period) {
        return res.status(400).json({ error: "Invalid period id" });
      }

      const now = new Date();
      const applicationStart = period.applicationPeriod.start;
      const applicationEnd = period.applicationPeriod.end;

      // Check if the current time is within the application period
      if (now < applicationStart || now > applicationEnd) {
        return res
          .status(400)
          .json({ error: "Not within the application period" });
      }

      const { applicant, error } = await createApplicant(requestBody);
      if (error) throw new Error(error);
      return res.status(201).json({ applicant });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
    res.status(500).json("An unexpected error occurred");
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

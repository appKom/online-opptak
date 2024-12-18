import { NextApiRequest, NextApiResponse } from "next";
import {
  deleteApplication,
  editApplication,
  getApplication,
} from "../../../../lib/mongo/applicants";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import {
  hasSession,
  isAdmin,
  checkOwId,
} from "../../../../lib/utils/apiChecks";
import { getPeriodById } from "../../../../lib/mongo/periods";
import { isApplicantType } from "../../../../lib/utils/validators";
import { applicantType } from "../../../../lib/types/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!hasSession(res, session)) return;

  const id = req.query.id;
  const periodId = req.query["period-id"];

  if (typeof id !== "string" || typeof periodId !== "string") {
    return res.status(400).json({ error: "Invalid format" });
  }

  if (!checkOwId(res, session, id)) return;

  const { period } = await getPeriodById(periodId);

  if (!period) {
    return res.status(404).json({ error: "Period not found" });
  }

  try {
    if (req.method === "GET") {
      const { application, exists, error } = await getApplication(id, periodId);
      if (error) {
        return res.status(500).json({ error });
      }
      return res.status(200).json({ exists, application });
    } else if (req.method === "DELETE") {
      const currentDate = new Date().toISOString();

      if (new Date(period.applicationPeriod.end) < new Date(currentDate)) {
        return res.status(403).json({ error: "Application period is over" });
      }

      const { error } = await deleteApplication(id, periodId);
      if (error) throw new Error(error);
      return res.status(204).end();
    } else if (req.method === "PUT") {
      const { application } = req.body;

      if (!application) {
        return res.status(400).json({ error: "Missing application data" });
      }

      const { period } = await getPeriodById(periodId);

      if (!period) {
        return res.status(400).json({ error: "Invalid period id" });
      }

      application.periodId = periodId;
      application.date = new Date(new Date().getTime() + 60 * 60 * 2000); // add date with norwegain time (GMT+2)

      if (!isApplicantType(application, period)) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      const now = new Date();
      const applicationStart = period.applicationPeriod.start;
      const applicationEnd = period.applicationPeriod.end;

      console.log(now < applicationStart || now > applicationEnd);

      if (now < applicationStart || now > applicationEnd) {
        return res
          .status(400)
          .json({ error: "Not within the application period" });
      }

      if (!isApplicantType(application, period)) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      const { error } = await editApplication(id, periodId, application);
      if (error) throw new Error(error);
      return res
        .status(200)
        .json({ message: "Application updated successfully" });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json("Unexpected error occurred");
  }

  res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

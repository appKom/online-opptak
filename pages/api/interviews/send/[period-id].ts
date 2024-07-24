import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import {
  hasSession,
  isAdmin,
  isInCommitee,
} from "../../../../lib/utils/apiChecks";
import { getInterviewsByPeriod } from "../../../../lib/mongo/interviews";
import { formatAndSendEmails } from "../../../../lib/utils/sendInterviewTimes/formatAndSend";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  const periodId = req.query["period-id"];

  if (!periodId || typeof periodId !== "string") {
    return res
      .status(400)
      .json({ error: "Invalid or missing periodId parameter" });
  }

  if (!hasSession(res, session)) return;
  if (!isInCommitee(res, session)) return;

  if (req.method === "POST") {
    if (!isAdmin(res, session)) return;
    const interviewData = req.body;

    try {
      const result = await formatAndSendEmails(interviewData);
      if (result && result.error) {
        throw new Error(result.error);
      }

      if (result?.error) throw new Error(result.error);
      return res.status(201).json({ result });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

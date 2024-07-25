import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import {
  hasSession,
  isAdmin,
  isInCommitee,
} from "../../../lib/utils/apiChecks";
import { sendOutInterviewTimes } from "../../../lib/utils/sendInterviewTimes/sendInterviewTimes";

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

    try {
      const result = await sendOutInterviewTimes({ periodId });
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

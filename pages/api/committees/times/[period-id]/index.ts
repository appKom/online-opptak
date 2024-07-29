import { NextApiRequest, NextApiResponse } from "next";
import {
  getCommittees,
  createCommittee,
  getCommitteesByPeriod,
} from "../../../../../lib/mongo/committees";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import {
  hasSession,
  isAdmin,
  isInCommitee,
} from "../../../../../lib/utils/apiChecks";
import {
  isCommitteeType,
  validateCommittee,
} from "../../../../../lib/utils/validators";
import { commiteeType } from "../../../../../lib/types/types";
import { getPeriodById } from "../../../../../lib/mongo/periods";

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

  if (req.method === "GET") {
    if (!isAdmin(res, session)) return;

    try {
      const committees = await getCommitteesByPeriod(periodId);
      return res.status(200).json({ committees });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    const committeeData: commiteeType = req.body;

    if (!isCommitteeType(req.body)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const { period } = await getPeriodById(String(committeeData.periodId));
    if (!period) {
      return res.status(400).json({ error: "Invalid periodId" });
    }

    if (!validateCommittee(committeeData, period)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    try {
      const { committee, error } = await createCommittee(
        committeeData,
        session!.user?.committees ?? [],
        periodId
      );
      if (error) throw new Error(error);

      return res.status(201).json({ committee });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["POST", "GET"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

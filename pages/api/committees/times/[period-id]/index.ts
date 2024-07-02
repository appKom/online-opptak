import { NextApiRequest, NextApiResponse } from "next";
import {
  getCommittees,
  createCommittee,
  deleteCommittee,
} from "../../../../../lib/mongo/committees";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import { hasSession, isInCommitee } from "../../../../../lib/utils/apiChecks";
import { isCommitteeType } from "../../../../../lib/utils/validators";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!hasSession(res, session)) return;
  if (!isInCommitee(res, session)) return;

  const periodId = req.query["period-id"];

  if (!periodId || typeof periodId !== "string") {
    return res
      .status(400)
      .json({ error: "Invalid or missing periodId parameter" });
  }

  if (req.method === "GET") {
    try {
      const { committees, error } = await getCommittees(
        session!.user?.committees ?? []
      );

      if (error) throw new Error(error);

      const filteredCommittees = committees!.filter(
        (committee: any) => committee.periodId === periodId
      );

      return res.status(200).json({ committees: filteredCommittees });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    const committeeData = req.body;

    if (!isCommitteeType(req.body)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    try {
      const { committee, error } = await createCommittee(
        committeeData,
        session!.user?.committees ?? []
      );
      if (error) throw new Error(error);

      return res.status(201).json({ committee });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    const committee = req.query.committee as string;

    if (!committee) {
      return res.status(400).json({ error: "Missing or invalid parameters" });
    }

    try {
      const { error } = await deleteCommittee(
        committee,
        periodId,
        session!.user?.committees ?? []
      );
      if (error) throw new Error(error);

      return res
        .status(200)
        .json({ message: "Committee successfully deleted." });
    } catch (error: any) {
      console.error("Deletion failed with error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

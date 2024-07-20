import { NextApiRequest, NextApiResponse } from "next";
import {
  getCommittees,
  deleteCommittee,
  updateCommitteeMessage,
} from "../../../../../lib/mongo/committees";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import { hasSession, isInCommitee } from "../../../../../lib/utils/apiChecks";

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
        periodId,
        session!.user?.committees ?? []
      );

      if (error) throw new Error(error);

      return res.status(200).json({ committees: committees });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    const { committee, message } = req.body;

    if (!committee) {
      console.error("Missing or invalid parameters", {
        committee,
      });
      return res.status(400).json({ error: "Missing or invalid parameters" });
    }

    try {
      const { updatedMessage, error } = await updateCommitteeMessage(
        committee,
        periodId,
        message,
        session!.user?.committees ?? []
      );
      if (error) throw new Error(error);

      return res.status(200).json({ message: updatedMessage });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    const committee = req.query.committee as string;

    if (!committee || !periodId) {
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

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

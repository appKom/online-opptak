import { NextApiRequest, NextApiResponse } from "next";
import {
  getCommittees,
  createCommittee,
  deleteCommittee,
} from "../../../lib/mongo/committees";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    try {
      const { committees, error } = await getCommittees();
      if (error) throw new Error(error);

      return res.status(200).json({ committees });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    const committeeData = req.body;
    try {
      const { committee, error } = await createCommittee(committeeData);
      if (error) throw new Error(error);

      return res.status(201).json({ committee });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    const committee = req.query.committee as string;
    const periodId = req.query.periodId as string;

    if (!committee || !periodId) {
      return res.status(400).json({ error: "Missing or invalid parameters" });
    }

    try {
      const { error } = await deleteCommittee(committee, periodId);
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

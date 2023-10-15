import { NextApiRequest, NextApiResponse } from "next";
import { getCommittees, createCommittee } from "../../../lib/mongo/committees";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

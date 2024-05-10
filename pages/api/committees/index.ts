import { NextApiRequest, NextApiResponse } from "next";
import {
  getCommittees,
  createCommittee,
  deleteCommittee,
} from "../../../lib/mongo/committees";

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

  if (req.method === "DELETE") {
    const { id } = req.query;

    console.log(id?.toString);

    if (!id || Array.isArray(id)) {
      return res
        .status(400)
        .json({ error: "Invalid or missing id parameter." });
    }

    try {
      const { success, error } = await deleteCommittee(id);
      if (error) throw new Error(error);

      return res
        .status(200)
        .json({ message: "Committee successfully deleted." });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

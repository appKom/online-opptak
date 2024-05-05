import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getPeriodById } from "../../../lib/mongo/periods";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(403).json({ error: "Access denied, no session" });
  }

  const id = req.query.id;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    if (req.method === "GET") {
      const { period, exists, error } = await getPeriodById(id);

      if (error) {
        return res.status(500).json({ error });
      }

      if (!exists) {
        return res.status(404).json({ message: "Period not found" });
      }

      return res.status(200).json({ exists, period });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json("Unexpected error occurred");
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;

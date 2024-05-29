import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { periodType } from "../../../lib/types/types";
import { createPeriod, getPeriods } from "../../../lib/mongo/periods";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(403).json({ error: "Access denied, no session" });
  }

  try {
    if (req.method === "GET") {
      const { periods, error } = await getPeriods();

      if (error) throw new Error(error);

      return res.status(200).json({ periods });
    }

    if (req.method === "POST") {
      if (session.user?.role !== "admin") {
        return res.status(403).json({ error: "Access denied, unauthorized" });
      }
      const period = req.body as periodType;

      const { error } = await createPeriod(period);
      if (error) throw new Error(error);
      return res.status(201).json({ message: "Period created successfully" });
    }
  } catch {
    res.status(500).json("An error occurred");
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

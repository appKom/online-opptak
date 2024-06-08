import { NextApiRequest, NextApiResponse } from "next";
import {
  deleteApplication,
  getApplication,
  getApplications,
} from "../../../../lib/mongo/applicants";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(403).json({ error: "Access denied, no session" });
  }

  const periodId = req.query["period-id"];

  if (typeof periodId !== "string") {
    return res.status(400).json({ error: "Invalid format" });
  }

  if (session?.user?.role !== "admin") {
    return res.status(403).json({ error: "Access denied, unauthorized" });
  }

  try {
    if (req.method === "GET") {
      const { applications, exists, error } = await getApplications(periodId);
      if (error) {
        return res.status(500).json({ error });
      }
      return res.status(200).json({ exists, applications });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json("Unexpected error occurred");
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

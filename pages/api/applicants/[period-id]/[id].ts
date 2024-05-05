import { NextApiRequest, NextApiResponse } from "next";
import {
  deleteApplication,
  getApplication,
} from "../../../../lib/mongo/applicants";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(403).json({ error: "Access denied, no session" });
  }

  const id = req.query.id;
  const periodId = req.query["period-id"];

  if (typeof id !== "string" || typeof periodId !== "string") {
    return res.status(400).json({ error: "Invalid format" });
  }

  if (session?.user?.role !== "admin" && session.user?.owId !== id) {
    return res.status(403).json({ error: "Access denied, unauthorized" });
  }

  try {
    if (req.method === "GET") {
      const { application, exists, error } = await getApplication(id, periodId);
      if (error) {
        return res.status(500).json({ error });
      }
      return res.status(200).json({ exists, application });
    } else if (req.method === "DELETE") {
      const { error } = await deleteApplication(id, periodId);
      if (error) throw new Error(error);
      return res.status(204).end();
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json("Unexpected error occurred");
  }

  res.setHeader("Allow", ["GET", "DELETE"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

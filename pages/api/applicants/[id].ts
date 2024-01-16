import { NextApiRequest, NextApiResponse } from "next";
import {
  getApplicantById,
  deleteApplicantById,
} from "../../../lib/mongo/applicants";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(403).json({ error: "Access denied, no session" });
  }

  const idString = req.query.id;

  if (typeof idString !== "string") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  if (session.user.role !== "admin" || session.user.owId !== idString) {
    return res.status(403).json({ error: "Access denied, unauthorized" });
  }

  try {
    const id = parseInt(idString, 10);

    if (req.method === "GET") {
      const { applicant, error } = await getApplicantById(id);
      if (error) throw new Error(error);
      if (!applicant)
        return res.status(404).json({ error: "Applicant not found" });
      return res.status(200).json({ applicant });
    } else if (req.method === "DELETE") {
      const { error } = await deleteApplicantById(id);
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

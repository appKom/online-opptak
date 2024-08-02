import { NextApiRequest, NextApiResponse } from "next";
import { getApplicationsForCommittee } from "../../../../../lib/mongo/applications";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(403).json({ error: "Access denied, no session" });
  }

  const periodId = req.query["period-id"];
  const selectedCommittee = req.query.committee;

  if (typeof selectedCommittee !== "string") {
    return res.status(400).json({ error: "Invalid committee parameter" });
  }

  if (!periodId || typeof periodId !== "string") {
    return res
      .status(400)
      .json({ error: "Invalid or missing periodId parameter" });
  }

  if (!session.user?.isCommittee || !session.user.committees) {
    return res.status(403).json({ error: "Access denied, unauthorized" });
  }

  try {
    if (req.method === "GET") {
      const { applications, error } = await getApplicationsForCommittee(
        periodId,
        selectedCommittee,
        session.user.committees
      );
      if (error) {
        return res.status(500).json({ error });
      }
      return res.status(200).json({ applications });
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

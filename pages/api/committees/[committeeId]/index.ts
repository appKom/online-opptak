import { NextApiRequest, NextApiResponse } from "next";
import { getCommittee } from "../../../../lib/mongo/committees";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { hasSession } from "../../../../lib/utils/apiChecks";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!hasSession(res, session)) return;

  // TODO check if in committee

  if (req.method === "GET") {
    const { committeeId } = req.query;
    if (typeof committeeId !== "string") {
      return res.status(400).json({ error: "Invalid committeeId" });
    }

    try {
      const { committee, error } = await getCommittee(committeeId);
      if (error) throw new Error(error);

      return res.status(200).json({ committee });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

import { NextApiRequest, NextApiResponse } from "next";
import { sendOutInterviewTimes } from "../../../lib/sendInterviewTimes/sendInterviewTimes";
import { isAdmin } from "../../../lib/utils/apiChecks";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      if (isAdmin(res, req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const result = await sendOutInterviewTimes();
      if (result === undefined) {
        throw new Error("An error occurred");
      }
      const { error } = result;
      if (error) throw new Error(error);
      return res.status(201).json({ message: "Period created successfully" });
    }
  } catch {
    return res.status(500).json("An error occurred");
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

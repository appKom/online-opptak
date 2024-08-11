import { NextApiRequest, NextApiResponse } from "next";
import { sendOutInterviewTimes } from "../../../lib/utils/sendInterviewTimes/sendInterviewTimes";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const secret = process.env.SEND_INTERVIEW_TIMES_SECRET;

  if (!secret) {
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    if (req.method === "POST") {
      const requestSecret = req.headers["x-secret"];

      //   if (!requestSecret || requestSecret !== secret) {
      //     return res.status(403).json({ message: "Forbidden" });
      //   }

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

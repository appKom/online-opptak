import { NextApiRequest, NextApiResponse } from "next";
import { sendOutInterviewTimes } from "../../../lib/utils/sendInterviewTimes/sendInterviewTimes";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      const result = await sendOutInterviewTimes();
      if (result === undefined) {
        throw new Error("An error occurred");
      }
      const { error } = result;
      if (error) throw new Error(error);
      return res.status(201).json({ message: "Period created successfully" });
    }
  } catch {
    res.status(500).json("An error occurred");
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

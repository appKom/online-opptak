import { NextApiRequest, NextApiResponse } from "next";
import { periodType } from "../../../lib/types/types";
import { createPeriod, getPeriods } from "../../../lib/mongo/periods";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!res) {
        console.error('Response object is undefined.');
        return;  // Early exit to prevent further execution
      }
  try {
    switch (req.method) {
      case "GET":
        const { periods, error: getError } = await getPeriods();
        if (getError) {
          res.status(500).json({ message: getError });
          return;
        }
        res.status(200).json({ periods });
        break;
      case "POST":
        const period = req.body as periodType;
        const { error: postError } = await createPeriod(period);
        if (postError) {
          res.status(500).json({ message: postError });
          return;
        }
        res.status(201).json({ message: "Period created successfully" });
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).json({ message: `Method ${req.method} is not allowed` });
        break;
    }
  } catch (error) {
    // Log the error for further investigation
    console.error('Error in handling request:', error);
    // Check if we can still send a response
    if (!res.headersSent) {
      res.status(500).json({ message: "An error occurred" });
    }
  }
};

export default handler;

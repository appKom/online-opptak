import { NextApiRequest, NextApiResponse } from "next";
import { createApplicant, getApplicants } from "../../../lib/mongo/applicants";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const { applicants, error } = await getApplicants();
      if (error) throw new Error(error);

      return res.status(200).json({ applicants });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    const applicantData = req.body;
    try {
      const { applicant, error } = await createApplicant(applicantData);
      if (error) throw new Error(error);

      return res.status(201).json({ applicant });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

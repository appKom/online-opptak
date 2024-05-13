// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "../../types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUser>,
) {
  res.status(200).json({ name: "John Doe", email: "john@gmail.com" });
}

import { ValidDates } from "../../types";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ dates: ValidDates }>
) {
  const dates: string[][] = [
    ["28.08", "29.08", "30.08", "31.08", "1.09"],
    ["4.09", "5.09", "6.09", "7.09", "8.09"],
  ];
  const year = "2023";

  res.status(200).json({ dates: { year, dates } });
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Interview } from "@prisma/client";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ interviews: Interview[] }>
) {
  let committee: string = "appkom";

  if (typeof committee !== "string") {
    res.status(200).send({ interviews: [] });
    return;
  }
  let id: { id: string } | null = await prisma.committee.findFirst({
    where: {
      name: committee,
    },
    select: {
      id: true,
    },
  });

  let interviewTimes: Interview[] | null = await prisma.interview.findMany({
    where: {
      committeeID: id?.id,
    },
  });

  res.status(200).json({ interviews: interviewTimes });
}

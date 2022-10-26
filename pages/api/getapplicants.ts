import { DBapplicant } from "../../types";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { Applicant, Prisma } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ applicants: DBapplicant[] | null }>
) {
  let committee = "appkom";
  let arr: Applicant[] | null = await prisma.applicant.findMany({
    where: {
      OR: [
        {
          committeechoice1: {
            contains: committee,
          },
        },
        {
          committeechoice2: {
            contains: committee,
          },
        },
        {
          committeechoice3: {
            contains: committee,
          },
        },
      ],
    },
  });

  res.status(200).json({ applicants: arr });
}

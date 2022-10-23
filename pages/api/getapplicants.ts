import { DBapplicant } from "../../types";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ applicants: DBapplicant[] | null }>
) {
  let committee = "appkom";
  let arr: DBapplicant[] | null = await prisma.applicant.findMany({
    select: {
      id: true,
      feminit: true,
      about: true,
      bankkom: true,
      committeechoice1: true,
      committeechoice2: true,
      committeechoice3: true,
      email: true,
      informatikkyear: true,
      name: true,
      phone: true,
    },
    where: {
      OR: [
        { committeechoice1: committee },
        { committeechoice2: committee },
        { committeechoice3: committee },
      ],
    },
  });
  console.log(arr);
  res.status(200).json({ applicants: arr });
}

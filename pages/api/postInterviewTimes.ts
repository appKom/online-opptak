// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prisma";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { ValidDates } from "../../types";
import getValidDates from "../../services/getValidDates";
import { Interview } from "@prisma/client";

export default async function handle(req: any, res: any) {
  const committee: string = req.body.committee;
  const interviews: Interview[] = req.body.interviews;

  // get valid dates
  const dev: boolean = process.env.NODE_ENV !== "production";
  const url: string = dev
    ? "http://localhost:3000/api/getValidDates"
    : "https://online-opptak-appkom.vercel.app/api/getValidDates";
  let validDates = await fetch(url).then((d) => d.json());
  if (validDates) {
    validDates = validDates.dates.dates.flat(1);
  }

  // validate dates
  for (let i of interviews) {
    if (!validDates.includes(i.date)) {
      res.send(400);
      return;
    }
  }

  let committeeID: { id: string } | null = await prisma.committee.findFirst({
    select: {
      id: true,
    },
    where: {
      name: committee,
    },
  });
  if (committeeID !== null) {
    // Delete current interviews
    await prisma.interview.deleteMany({
      where: {
        committeeID: committeeID.id,
      },
    });
    // Format interviews
    interviews.forEach((i) => {
      i.committeeID = committeeID?.id ? committeeID.id : null;
      i.applicantID = null;
    });

    // Add new times
    await prisma.interview.createMany({
      data: interviews,
    });

    res.send(200);
  } else {
    res.send(400);
  }
}

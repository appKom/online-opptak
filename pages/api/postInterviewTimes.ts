// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prisma";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { ValidDates } from "../../types";
import getValidDates from "../../services/getValidDates";

interface DBInterview {
  date: string;
  fromTime: string;
  toTime: string;
  committeeID: string;
  applicantID: undefined;
}

interface FormInterview {
  date: string;
  time: string;
}

export default async function handle(req: any, res: any) {
  const committee: string = req.body.committee;
  const interviews: FormInterview[] = req.body.interviews;

  // get valid dates
  const dev: boolean = process.env.NODE_ENV !== "production";
  const url: string = dev
    ? "http://localhost:3000/api/getValidDates"
    : "realurl";
  let validDates = await fetch(url).then((d) => d.json());
  if (validDates) {
    validDates = validDates.dates.dates.flat(1);
  }

  // validate dates
  let valid: boolean = true;
  for (let i of interviews) {
    if (!validDates.includes(i.date)) {
      valid = false;
      break;
    }
  }
  if (!valid) {
    res.send(200);
    return;
  }

  let committeeID: { id: string } | null = await prisma.committee.findFirst({
    select: {
      id: true,
    },
    where: {
      name: committee,
    },
  });
  if (!committeeID) {
    res.send(400);
  } else {
    let data: DBInterview[] = [];
    // Format inteviews like DB
    for (let i of interviews) {
      data.push({
        applicantID: undefined,
        committeeID: committeeID?.id,
        date: i.date,
        fromTime: i.time.replace(" ", "").split("-")[0],
        toTime: i.time.replace(" ", "").split("-")[1],
      });
    }
    // Delete previous times
    await prisma.interview.deleteMany({
      where: {
        committeeID: committeeID.id,
      },
    });
    // Add new times
    await prisma.interview.createMany({
      data: data,
    });

    res.send(200);
  }
}

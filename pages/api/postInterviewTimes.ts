// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prisma";

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

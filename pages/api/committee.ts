// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '../../lib/prisma';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content


export default async function handle(req: any, res: any) {
  const committee: string = req.body.committee;
  const password: string = req.body.password;

  const commData = await prisma.committee.findFirst({
    where: { name: committee },

  });
  
  if (commData?.password == password) {
    console.log('success');
  } else {
    console.log('fail');
  }


/*
  const result = await prisma.committee.create({
    data: {
      name: committee,
      password: password,
    },
  });*/

}

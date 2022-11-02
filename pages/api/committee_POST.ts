// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '../../lib/prisma';

interface Interview {
  date: string;
  time: string;
}


export default async function handle(req: any, res: any) {
  const committee: string = req.body.committee;
  const password: string = req.body.password;
  const interviews: Interview[] = req.body.interviews;

  
 

}

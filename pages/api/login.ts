import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      res.redirect(
        `https://old.online.ntnu.no/openid/authorize?` +
          `client_id=${process.env.CLIENT_ID}` +
          `&redirect_uri=${encodeURIComponent(
            process.env.REDIRECT_URI as string
          )}` +
          `&response_type=code` +
          `&scope=openid+profile+onlineweb4`
      );

      return res.status(302);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

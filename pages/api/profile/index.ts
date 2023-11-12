import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res
          .status(401)
          .json({ error: "Authorization header is missing." });
      }

      const profileResponse = await fetch(
        "https://old.online.ntnu.no/api/v1/profile/",
        {
          method: "GET",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        }
      );

      if (!profileResponse.ok) {
        throw new Error(
          `Failed to fetch profile: ${profileResponse.statusText}`
        );
      }

      const profileData = await profileResponse.json();

      return res.status(200).json(profileData);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

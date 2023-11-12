import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      // Extract the Authorization header from the incoming request
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res
          .status(401)
          .json({ error: "Authorization header is missing." });
      }

      // Make the API call to the external service
      const profileResponse = await fetch(
        "https://old.online.ntnu.no/api/v1/profile/",
        {
          method: "GET",
          headers: {
            Authorization: authHeader, // Pass the Authorization header along
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the response from the external API is ok
      if (!profileResponse.ok) {
        // If not, throw an error with the status text from the external API
        throw new Error(
          `Failed to fetch profile: ${profileResponse.statusText}`
        );
      }

      // Parse the response data
      const profileData = await profileResponse.json();

      // Return the profile data to the client
      return res.status(200).json(profileData);
    } catch (error) {
      // If there's an error, return a 500 status code and the error message
      return res.status(500).json({ error: error.message });
    }
  }

  // If the method is not GET, return a 405 Method Not Allowed error
  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;

import { getRestaurants } from "../../lib/mongo/restaurants";

const handler = async (req: any, res: any) => {
  if (req.method === "GET") {
    try {
      const { restaurants, error } = await getRestaurants();
      if (error) throw new Error(error);

      return res.status(200).json({ restaurants });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(425).end(`Method ${req.method} is not allowed.`);
};

export default handler;

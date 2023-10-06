import { Collection, Db, MongoClient } from "mongodb";
import clientPromise from "./mongodb";

let client: MongoClient;
let db: Db;
let restaurants: Collection<any>;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = await client.db();
    restaurants = await db.collection("restaurants");
  } catch (error) {
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

export async function getRestaurants() {
  try {
    if (!restaurants) await init();
    const result = await restaurants
      .find({})
      .limit(20)
      .map((user: any) => ({ ...user, _id: user._id.toString() }))
      .toArray();

    return { restaurants: result };
  } catch (error) {
    return { error: "Failed to fetch restaurants" };
  }
}

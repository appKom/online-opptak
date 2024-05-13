import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { periodType } from "../types/types";

let client: MongoClient;
let db: Db;
let periods: Collection<periodType>;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db();
    periods = db.collection("period");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

export const createPeriod = async (periodData: periodType) => {
  try {
    if (!periods) await init();

    const result = await periods.insertOne(periodData);
    if (result.insertedId) {
      const insertedPeriod = await periods.findOne({
        _id: result.insertedId,
      });
      if (insertedPeriod) {
        return { period: insertedPeriod };
      } else {
        return { error: "Failed to retrieve the created period" };
      }
    } else {
      return { error: "Failed to create period" };
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to create period" };
  }
};

export const getPeriods = async () => {
  try {
    if (!periods) await init();
    const result = await periods.find({}).toArray();
    return { periods: result };
  } catch (error) {
    return { error: "Failed to fetch periods" };
  }
};

export const getCurrentPeriods = async () => {
  try {
    if (!periods) await init();

    const currentDate = new Date().toISOString();

    const filter = {
      $or: [
        {
          "timePeriod.start": { $lte: currentDate },
          "timePeriod.end": { $gte: currentDate },
        },
      ],
    };

    const result = await periods.find(filter).toArray();

    return { result: result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch periods" };
  }
};

export const getPeriodById = async (id: string | ObjectId) => {
  try {
    if (!periods) await init();

    if (typeof id === "string" && !id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error("Invalid ID format");
      return { error: "Invalid ID format", exists: false };
    }

    const period = await periods.findOne({ _id: new ObjectId(id) });

    if (period) {
      return { exists: true, period };
    } else {
      console.log("Period not found");
      return { exists: false };
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch period by ID", exists: false };
  }
};
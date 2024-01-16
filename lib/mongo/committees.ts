import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { commiteeType } from "../types/types";

let client: MongoClient;
let db: Db;
let committees: Collection<commiteeType>;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db();
    committees = db.collection("commitee");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

export const getCommittees = async () => {
  try {
    if (!committees) await init();
    const result = await committees.find({}).toArray();
    return { committees: result };
  } catch (error) {
    return { error: "Failed to fetch committees" };
  }
};

export const getCommittee = async (id: string) => {
  try {
    if (!committees) await init();
    const result = await committees.findOne({ _id: new ObjectId(id) });
    if (result) {
      return { committee: result };
    } else {
      return { error: "No committee found with the specified ID" };
    }
  } catch (error) {
    return { error: "Failed to fetch committee" };
  }
};

export const updateAvailableTimes = async (
  id: string,
  times: [{ start: string; end: string }]
) => {
  try {
    if (!committees) await init();
    const result = await committees.updateOne(
      { _id: new ObjectId(id) },
      { $set: { availableTimes: times } }
    );
    if (result.matchedCount > 0) {
      return { message: "Available times updated successfully" };
    } else {
      return { error: "No committee found with the specified ID" };
    }
  } catch (error) {
    return { error: "Failed to update availableTimes" };
  }
};

export const createCommittee = async (committeeData: commiteeType) => {
  try {
    if (!committees) await init();

    // Parse committeeData if it's a string
    const parsedCommitteeData =
      typeof committeeData === "string"
        ? JSON.parse(committeeData)
        : committeeData;

    const result = await committees.insertOne(parsedCommitteeData);
    if (result.insertedId) {
      const insertedCommittee = await committees.findOne({
        _id: result.insertedId,
      });
      if (insertedCommittee) {
        return { committee: insertedCommittee };
      } else {
        return { error: "Failed to retrieve the created committee" };
      }
    } else {
      return { error: "Failed to create committee" };
    }
  } catch (error) {
    return { error: "Failed to create committee" };
  }
};

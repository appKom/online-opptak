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
    committees = db.collection("committee");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

const userHasAccessList = (
  userCommittees: string[],
  dbCommittees: string[]
) => {
  return dbCommittees.some((dbCommittee) =>
    userCommittees.includes(dbCommittee)
  );
};

const userHasAccessCommittee = (
  userCommittees: string[],
  dbCommittees: string
) => {
  return userCommittees.includes(dbCommittees);
};

export const getCommittees = async (userCommittees: string[]) => {
  try {
    if (!committees) await init();
    const result = await committees
      .find({ committee: { $in: userCommittees } })
      .toArray();
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

export const createCommittee = async (
  committeeData: commiteeType,
  userCommittes: string[]
) => {
  try {
    if (!committees) await init();
    if (!userHasAccessCommittee(userCommittes, committeeData.committee)) {
      return { error: "User does not have access to this committee" };
    }

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
export const deleteCommittee = async (
  committee: string,
  periodId: string,
  userCommittees: string[]
) => {
  try {
    if (!committees) await init();
    if (!userHasAccessCommittee(userCommittees, committee)) {
      return { error: "User does not have access to this committee" };
    }

    let validPeriodId = periodId;
    if (typeof periodId === "string") {
      if (!ObjectId.isValid(periodId)) {
        console.error("Invalid ObjectId:", periodId);
        return { error: "Invalid ObjectId format" };
      }
      validPeriodId = periodId;
    }

    const count = await committees.countDocuments({
      committee: committee,
      periodId: validPeriodId,
    });
    if (count === 0) {
      return { error: "Committee not found or already deleted" };
    }

    const result = await committees.deleteOne({
      committee: committee,
      periodId: validPeriodId,
    });

    if (result.deletedCount === 1) {
      return { message: "Committee deleted successfully" };
    } else {
      return { error: "Committee not found or already deleted" };
    }
  } catch (error) {
    return { error: "Failed to delete committee" };
  }
};

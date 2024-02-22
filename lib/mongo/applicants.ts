import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { applicantType } from "../types/types";

let client: MongoClient;
let db: Db;
let applicants: Collection<applicantType>;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db();
    applicants = db.collection("applicant");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

export const createApplicant = async (applicantData: applicantType) => {
  try {
    if (!applicants) await init();

    const result = await applicants.insertOne(applicantData);
    if (result.insertedId) {
      const insertedApplicant = await applicants.findOne({
        _id: result.insertedId,
      });
      if (insertedApplicant) {
        return { applicant: insertedApplicant };
      } else {
        return { error: "Failed to retrieve the created applicant" };
      }
    } else {
      return { error: "Failed to create applicant" };
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to create applicant" };
  }
};

export const getApplicants = async () => {
  try {
    if (!applicants) await init();
    const result = await applicants.find({}).toArray();
    return { applicants: result };
  } catch (error) {
    return { error: "Failed to fetch applicants" };
  }
};

export const getApplication = async (
  id: string,
  periodId: string | ObjectId
) => {
  try {
    if (!applicants) await init();

    const result = await applicants.findOne({
      owId: id,
      periodId: new ObjectId(periodId),
    });

    return { application: result, exists: !!result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch application", exists: false };
  }
};

export const deleteApplication = async (
  owId: string,
  periodId: string | ObjectId
) => {
  try {
    if (!applicants) await init();

    const result = await applicants.deleteOne({
      owId: owId,
      periodId: new ObjectId(periodId),
    });

    if (result.deletedCount === 1) {
      return { message: "Application deleted successfully" };
    } else {
      return { error: "Application not found or already deleted" };
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete application" };
  }
};

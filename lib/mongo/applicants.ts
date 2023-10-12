import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { applicantType, commiteeType } from "../types";

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

export const createApplicant = async (
  applicantData: applicantType | string,
) => {
  try {
    if (!applicants) await init();

    const parsedApplicantData =
      typeof applicantData === "string"
        ? JSON.parse(applicantData)
        : applicantData;

    const result = await applicants.insertOne(parsedApplicantData);
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

export const updateSelectedTimes = async (
  id: string,
  selectedTimes: [{ start: string; end: string }],
) => {
  try {
    if (!applicants) await init();
    const result = await applicants.updateOne(
      { _id: new ObjectId(id) },
      { $set: { selectedTimes: selectedTimes } },
    );
    if (result.matchedCount > 0) {
      return { message: "Selected times updated successfully" };
    } else {
      return { error: "No applicant found with the specified ID" };
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to update selected times" };
  }
};

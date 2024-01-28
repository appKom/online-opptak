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

export const getApplicantById = async (id: string) => {
  try {
    if (!applicants) await init();
    const result = await applicants.findOne({ owId: id });
    return { applicant: result };
  } catch (error) {
    return { error: "Failed to fetch applicant" };
  }
};

export const deleteApplicantById = async (id: string) => {
  try {
    if (!applicants) await init();

    const result = await applicants.deleteOne({ owId: id });

    if (result.deletedCount === 0) {
      return { error: "No applicant found with the specified ID" };
    } else {
      return { message: "Applicant deleted successfully" };
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete applicant" };
  }
};
export const updateSelectedTimes = async (
  id: string,
  selectedTimes: [{ start: string; end: string }]
) => {
  try {
    if (!applicants) await init();
    const result = await applicants.updateOne(
      { _id: new ObjectId(id) },
      { $set: { selectedTimes: selectedTimes } }
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

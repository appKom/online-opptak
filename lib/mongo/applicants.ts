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

    const existingApplicant = await applicants.findOne({
      owId: applicantData.owId,
      periodId: applicantData.periodId,
    });

    if (existingApplicant) {
      return { error: "409 Application already exists for this period" };
    }

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
      periodId: periodId,
    });

    return { application: result, exists: !!result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch application", exists: false };
  }
};

export const getApplications = async (periodId: string) => {
  try {
    if (!applicants) await init();

    const result = await applicants
      .find({ periodId: periodId }) // No ObjectId conversion needed
      .toArray();

    return { applications: result, exists: result.length > 0 };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch applications" };
  }
};

export const getApplicantsForCommittee = async (
  periodId: string,
  userCommittees: string[]
) => {
  try {
    if (!applicants) await init();

    // Henter alle søkere for perioden
    const result = await applicants.find({ periodId: periodId }).toArray();

    //Filtrerer søkerne slik at kun brukere som er i komiteen som har blitt søkt på ser søkeren
    //Fjerner prioriterings informasjon
    const filteredApplicants = result
      .map((applicant) => {
        // Check if preferences are in the form of first, second, third
        let preferencesArray: { committee: string }[];
        if ("first" in applicant.preferences) {
          preferencesArray = [
            { committee: applicant.preferences.first },
            { committee: applicant.preferences.second },
            { committee: applicant.preferences.third },
          ];
        } else {
          preferencesArray = applicant.preferences as { committee: string }[];
        }

        //Sjekker om brukerens komite er blant søkerens komiteer
        const hasCommonCommittees = preferencesArray.some((preference) =>
          userCommittees.includes(preference.committee)
        );

        if (hasCommonCommittees) {
          // Fjerner prioriteringer
          const { preferences, ...rest } = applicant;
          const filteredPreferences = preferencesArray.filter((preference) =>
            userCommittees.includes(preference.committee)
          );

          return { ...rest, preferences: filteredPreferences };
        }
        return null;
      })
      .filter((applicant) => applicant !== null);

    return { applicants: filteredApplicants };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch applicants" };
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
      periodId: periodId,
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

import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { applicationType, preferencesType } from "../types/types";

let client: MongoClient;
let db: Db;
let applications: Collection<applicationType>;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db();
    applications = db.collection("application");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

export const createApplication = async (applicationData: applicationType) => {
  try {
    if (!applications) await init();

    const existingApplication = await applications.findOne({
      owId: applicationData.owId,
      periodId: applicationData.periodId,
    });

    if (existingApplication) {
      return { error: "409 Application already exists for this period" };
    }

    const result = await applications.insertOne(applicationData);
    if (result.insertedId) {
      const insertedApplication = await applications.findOne({
        _id: result.insertedId,
      });
      if (insertedApplication) {
        return { application: insertedApplication };
      } else {
        return { error: "Failed to retrieve the created application" };
      }
    } else {
      return { error: "Failed to create application" };
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to create application" };
  }
};

export const getApplications = async () => {
  try {
    if (!applications) await init();
    const result = await applications.find({}).toArray();
    return { applications: result };
  } catch (error) {
    return { error: "Failed to fetch applications" };
  }
};

export const getApplication = async (
  id: string,
  periodId: string | ObjectId
) => {
  try {
    if (!applications) await init();

    const result = await applications.findOne({
      owId: id,
      periodId: periodId,
    });

    return { application: result, exists: !!result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch application", exists: false };
  }
};

export const getApplicationsByPeriodId = async (periodId: string) => {
  try {
    if (!applications) await init();

    const result = await applications
      .find({ periodId: periodId }) // No ObjectId conversion needed
      .toArray();

    return { applications: result, exists: result.length > 0 };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch applications" };
  }
};

export const getApplicationsForCommittee = async (
  periodId: string,
  selectedCommittee: string,
  userCommittees: string[]
) => {
  try {
    if (!applications) await init();

    // Henter alle søkere for perioden
    const result = await applications.find({ periodId: periodId }).toArray();

    // Type guard
    const isPreferencesType = (
      preferences: any
    ): preferences is preferencesType => {
      return (
        preferences &&
        typeof preferences.first === "string" &&
        typeof preferences.second === "string" &&
        typeof preferences.third === "string"
      );
    };

    // Filtrerer søkerne slik at kun brukere som er i komiteen som har blitt søkt på ser søkeren
    // Fjerner prioriterings informasjon
    const filteredApplications = result
      .map((application) => {
        let preferencesArray: string[] = [];
        if (isPreferencesType(application.preferences)) {
          preferencesArray = [
            application.preferences.first,
            application.preferences.second,
            application.preferences.third,
          ];
        } else if (Array.isArray(application.preferences)) {
          preferencesArray = application.preferences.map(
            (pref) => pref.committee
          );
        }

        if (application.optionalCommittees != null) {
          if (application.optionalCommittees.length > 0) {
            for (const committee of application.optionalCommittees) {
              preferencesArray.push(committee);
            }
          }
        }

        // Sjekker om brukerens komite er blant søkerens komiteer
        const hasCommonCommittees = preferencesArray.some((preference) =>
          userCommittees.includes(preference)
        );

        application.optionalCommittees = [];

        const isSelectedCommitteePresent =
          preferencesArray.includes(selectedCommittee);

        if (hasCommonCommittees && isSelectedCommitteePresent) {
          // Fjerner prioriteringer
          const { preferences, ...rest } = application;
          const filteredPreferences = preferencesArray
            .filter((preference) => userCommittees.includes(preference))
            .map((committee) => ({ committee }));

          return { ...rest, preferences: filteredPreferences };
        }
        return null;
      })
      .filter((application) => application !== null);

    return { applications: filteredApplications };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch applications" };
  }
};

export const deleteApplication = async (
  owId: string,
  periodId: string | ObjectId
) => {
  try {
    if (!applications) await init();

    const result = await applications.deleteOne({
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

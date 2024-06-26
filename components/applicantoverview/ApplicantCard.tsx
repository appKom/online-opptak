import { applicantType, preferencesType } from "../../lib/types/types";

interface Props {
  filteredApplications: applicantType[] | undefined;
  applicationsExist: boolean;
  includePreferences?: boolean;
}

const isApplicantType = (applicant: any): applicant is applicantType => {
  return "optionalCommittees" in applicant;
};

const isPreferencesType = (
  preferences: any
): preferences is preferencesType => {
  return "first" in preferences;
};

const ApplicantCard = ({
  filteredApplications,
  applicationsExist,
  includePreferences,
}: Props) => {
  if (applicationsExist && filteredApplications?.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredApplications.map((applicant, index) => (
          <div
            key={index}
            className="flex flex-col justify-between h-full p-4 border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
          >
            <div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-online-snowWhite">
                {applicant.name}
              </h3>
              <div className="w-full mt-1 text-sm">
                <p className="">Om: {applicant.about}</p>
                <p>Trinn: {applicant.grade}</p>
                <p>Telefon: {applicant.phone}</p>
                <p>E-post: {applicant.email}</p>
                <p>Bankom: {applicant.bankom}</p>
              </div>

              {includePreferences &&
                isPreferencesType(applicant.preferences) && (
                  <div>
                    <p className="mt-1 text-sm">Komiteer: </p>
                    <p className="mt-1 text-sm">
                      1. {applicant.preferences.first}, 2.{" "}
                      {applicant.preferences.second}, 3.{" "}
                      {applicant.preferences.third}
                    </p>
                  </div>
                )}
              {isApplicantType(applicant) &&
                includePreferences &&
                applicant.optionalCommittees != null && (
                  <div>
                    <p className="mt-1 text-sm">Valgfrie Komiteer: </p>
                    <p className="mt-1 text-sm">
                      {" "}
                      {applicant.optionalCommittees.join(", ")}
                    </p>
                  </div>
                )}
              <p className="mt-1 text-sm">
                Dato: {new Date(applicant.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <p>Ingen søknader</p>;
};

export default ApplicantCard;

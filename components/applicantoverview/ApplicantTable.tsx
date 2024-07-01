import { applicantType, preferencesType } from "../../lib/types/types";
import ApplicantCard from "./ApplicantCard";

interface Props {
  filteredApplications: applicantType[] | undefined;
  applicationsExist: boolean;
  includePreferences: boolean;
  optionalCommitteesExist: boolean;
}

const isApplicantType = (applicant: any): applicant is applicantType => {
  return "optionalCommittees" in applicant;
};

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

const ApplicantTable = ({
  filteredApplications,
  applicationsExist,
  includePreferences,
  optionalCommitteesExist,
}: Props) => {
  if (applicationsExist && filteredApplications?.length) {
    const headers = [
      "Navn",
      "Om",
      ...(includePreferences ? ["1. Komitee", "2. Komitee", "3. Komitee"] : []),
      ...(optionalCommitteesExist && includePreferences
        ? ["Valgfrie komiteer"]
        : []),
      "Bankom",
      "Dato",
      "Klasse",
      "Telefon",
      "E-post",
    ];

    return (
      <div className="flex flex-col">
        <div className="hidden md:flex px-20">
          <table className="min-w-full text-start border border-collapse border-gray-200 dark:bg-online-darkBlue dark:border-gray-700">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="p-2 border border-gray-200 dark:border-gray-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((applicant, index) => (
                <tr key={index}>
                  <td className="p-2 border border-gray-200 dark:border-gray-700 align-top">
                    {applicant.name}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700 align-top">
                    {applicant.about}
                  </td>
                  {includePreferences &&
                    isPreferencesType(applicant.preferences) && (
                      <>
                        <td className="p-2 border border-gray-200 dark:border-gray-700 align-top">
                          {applicant.preferences.first}
                        </td>
                        <td className="p-2 border border-gray-200 dark:border-gray-700 align-top">
                          {applicant.preferences.second}
                        </td>
                        <td className="p-2 border border-gray-200 dark:border-gray-700 align-top">
                          {applicant.preferences.third}
                        </td>
                      </>
                    )}
                  {optionalCommitteesExist &&
                    includePreferences &&
                    isApplicantType(applicant) && (
                      <td className="p-2 border border-gray-200 dark:border-gray-700 align-top">
                        {applicant.optionalCommittees.join(", ")}
                      </td>
                    )}
                  <td className="p-2 border border-gray-200 dark:border-gray-700 align-top">
                    {applicant.bankom}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700 align-top">
                    {new Date(applicant.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700 align-top">
                    {applicant.grade}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700 align-top">
                    {applicant.phone}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700 align-top">
                    {applicant.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap justify-start md:hidden px-10">
          <ApplicantCard
            filteredApplications={filteredApplications}
            applicationsExist={applicationsExist}
            includePreferences={includePreferences}
          />
        </div>
        {applicationsExist && (
          <p className="text-right p-5">
            {filteredApplications.length} resultater
          </p>
        )}
      </div>
    );
  } else {
    return <p>Ingen søknader.</p>;
  }
};

export default ApplicantTable;

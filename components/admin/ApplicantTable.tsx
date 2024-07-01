import {
  applicantType,
  applicantTypeForCommittees,
} from "../../lib/types/types";
import ApplicantCard from "./ApplicantCard";

interface Props {
  filteredApplications:
    | applicantType[]
    | applicantTypeForCommittees[]
    | undefined;
  applicationsExist: boolean;
  includePreferences: boolean;
  optionalCommitteesExist: boolean;
}

const isApplicantType = (applicant: any): applicant is applicantType => {
  return "optionalCommittees" in applicant;
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
      ...(includePreferences ? ["1. Komitee", "2. Komitee", "3. Komitee"] : []),
      ...(optionalCommitteesExist ? ["Valgfrie komiteer"] : []),
      "Dato",
      "Klasse",
      "Telefon",
    ];

    return (
      <div>
        <div className="hidden md:flex">
          <table className="min-w-full border border-collapse border-gray-200 dark:bg-online-darkBlue dark:border-gray-700">
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
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.name}
                  </td>
                  {includePreferences && isApplicantType(applicant) && (
                    <>
                      <td className="p-2 border border-gray-200 dark:border-gray-700">
                        {applicant.preferences.first}
                      </td>
                      <td className="p-2 border border-gray-200 dark:border-gray-700">
                        {applicant.preferences.second}
                      </td>
                      <td className="p-2 border border-gray-200 dark:border-gray-700">
                        {applicant.preferences.third}
                      </td>
                    </>
                  )}
                  {optionalCommitteesExist && isApplicantType(applicant) && (
                    <td className="p-2 border border-gray-200 dark:border-gray-700">
                      {applicant.optionalCommittees.join(", ")}
                    </td>
                  )}
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {new Date(applicant.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.grade}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col space-y-4 md:hidden">
          <ApplicantCard
            filteredApplications={filteredApplications}
            applicationsExist={applicationsExist}
            includePreferences={includePreferences}
          />
        </div>
      </div>
    );
  } else {
    return <p>Ingen søknader.</p>;
  }
};

export default ApplicantTable;

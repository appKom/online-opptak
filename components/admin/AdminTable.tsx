import { applicantType } from "../../lib/types/types";
import AdminCard from "./AdminCard";

interface Props {
  filteredApplications: applicantType[] | undefined;
  applicationsExist: boolean;
}

const AdminTable = ({ filteredApplications, applicationsExist }: Props) => {
  if (applicationsExist && filteredApplications?.length)
    return (
      <div>
        <div className="hidden md:flex">
          <table className="min-w-full border border-collapse border-gray-200 dark:bg-online-darkBlue dark:border-gray-700">
            <thead>
              <tr>
                {[
                  "Navn",
                  "1. Komitee",
                  "2. Komitee",
                  "3. Komitee",
                  "Valgfrie komiteer",
                  "Dato",
                  "Klasse",
                  "Telefon",
                ].map((header) => (
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
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.preferences.first}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.preferences.second}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.preferences.third}
                  </td>
                  <td className="p-2 border border-gray-200 dark:border-gray-700">
                    {applicant.optionalCommittees.join(", ")}{" "}
                  </td>
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
          <AdminCard
            filteredApplications={filteredApplications}
            applicationsExist={applicationsExist}
            includePreferences={true}
          />
        </div>
      </div>
    );
  else return <p>Ingen søknader.</p>;
};

export default AdminTable;

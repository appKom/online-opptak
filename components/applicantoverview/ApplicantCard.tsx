import { useState } from "react";
import { applicantType } from "../../lib/types/types";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { changeDisplayName } from "../../lib/utils/toString";

interface Props {
  applicant: applicantType | undefined;
  includePreferences: boolean;
}

const ApplicantCard = ({ applicant, includePreferences }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const preferences = applicant?.preferences || {};
  const filteredPreferences = Object.entries(preferences).filter(
    ([key, value]) => value
  );

  console.log(applicant);

  return (
    <div className="w-full p-4 my-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div
        onClick={handleToggle}
        className="flex items-center justify-between cursor-pointer"
      >
        <div>
          <h2 className="text-lg font-semibold">{applicant?.name}</h2>
          <p className="text-gray-800 dark:text-gray-300">
            {applicant?.grade}. Klasse
          </p>
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 transition-transform duration-300 transform ${
            isExpanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? "opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <h1 className="text-lg font-semibold">Kontakt:</h1>
        <p>Epost: {applicant?.email}</p>
        <p>Telefon: {applicant?.phone}</p>

        {includePreferences && (
          <div>
            <h1 className="text-lg font-semibold pt-3">Komiteer:</h1>
            <ul>
              {filteredPreferences.map(([key, value], index) => (
                <li key={index}>{`${index + 1}. ${changeDisplayName(
                  value as string
                )}`}</li>
              ))}
            </ul>

            {applicant?.optionalCommittees && (
              <div className="pt-3">
                <h1 className="text-lg font-semibold">Andre valg:</h1>
                <p>
                  {applicant?.optionalCommittees
                    .map(changeDisplayName)
                    .join(", ") || "Ingen valg"}{" "}
                </p>
              </div>
            )}
          </div>
        )}

        <h1 className="text-lg font-semibold pt-3">Om:</h1>
        <p>Bankom: {applicant?.bankom}</p>
        <div className="p-4 mt-2 bg-gray-100 rounded-lg dark:bg-gray-700">
          <p className="whitespace-pre-wrap">{applicant?.about}</p>
        </div>
      </div>
    </div>
  );
};

export default ApplicantCard;

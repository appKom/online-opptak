import { useState } from "react";
import { applicantType } from "../../lib/types/types";
import { FaChevronDown } from "react-icons/fa";

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

  return (
    <div
      onClick={handleToggle}
      className="w-full max-w-md mx-auto my-4 p-4 bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-md cursor-pointer"
      style={{ width: "1000px" }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{applicant?.name}</h2>
          <p className="text-gray-800 dark:text-gray-300">
            {applicant?.grade}. Klasse
          </p>
        </div>
        <FaChevronDown
          className={`text-white transition-transform duration-300 transform ${
            isExpanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-screen opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <h1 className="font-semibold text-lg">Kontakt:</h1>
        <p>Epost: {applicant?.email}</p>
        <p>Telefon: {applicant?.phone}</p>

        {includePreferences && (
          <div>
            <br />
            <h1 className="font-semibold text-lg">Komiteer:</h1>
            <ul>
              {Object.keys(preferences).map((key, index) => (
                <li key={index}>{`${index + 1}. ${
                  preferences[key as keyof typeof preferences]
                }`}</li>
              ))}
            </ul>

            {applicant?.optionalCommittees != null && (
              <div>
                <br />
                <h1 className="font-semibold text-lg">Valgfrie Komiteer:</h1>
                <p>
                  {applicant?.optionalCommittees.join(", ") || "Ingen valg"}{" "}
                </p>
              </div>
            )}
          </div>
        )}
        <br />
        <h1 className="font-semibold text-lg">Om:</h1>
        <p>Bankom: {applicant?.bankom}</p>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mt-2">
          <p>{applicant?.about}</p>
        </div>
      </div>
    </div>
  );
};

export default ApplicantCard;

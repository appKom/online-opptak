import {
  applicantType,
  applicantTypeForCommittees,
} from "../../lib/types/types";

interface Props {
  filteredApplications:
    | applicantType[]
    | applicantTypeForCommittees[]
    | undefined;
  applicationsExist: boolean;
  includePreferences?: boolean;
}

const isApplicantType = (applicant: any): applicant is applicantType => {
  return "optionalCommittees" in applicant;
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
              <p className="w-full mt-1">Om: {applicant.about}</p>
              <p className="mt-1 text-sm ">Trinn: {applicant.grade}</p>
              <p className="mt-1 text-sm">Telefon: {applicant.phone}</p>
              <p className="mt-1 text-sm">E-post: {applicant.email}</p>
              <p className="mt-1 text-sm">Bankom: {applicant.bankom}</p>

              {includePreferences && isApplicantType(applicant) && (
                <div>
                  <p className="mt-1 text-sm">Komiteer: </p>
                  <p className="mt-1 text-sm">
                    1. {applicant.preferences.first}, 2.{" "}
                    {applicant.preferences.second}, 3.{" "}
                    {applicant.preferences.third}
                  </p>
                  {isApplicantType(applicant) &&
                    applicant.optionalCommittees != null && (
                      <div>
                        <p className="mt-1 text-sm">Valgfrie Komiteer: </p>
                        <p className="mt-1 text-sm">
                          {" "}
                          {applicant.optionalCommittees}
                        </p>
                      </div>
                    )}
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

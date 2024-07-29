import { applicantType } from "../../lib/types/types";
import ApplicantCard from "./ApplicantCard";

interface Props {
  filteredApplications: applicantType[] | undefined;
  includePreferences: boolean;
}

const ApplicantTable = ({
  filteredApplications,
  includePreferences,
}: Props) => {
  return (
    <div className="flex flex-col ">
      {filteredApplications?.map((applicant) => (
        <ApplicantCard
          key={applicant.owId}
          applicant={applicant}
          includePreferences={includePreferences}
        />
      ))}
      <p className="text-end ">{filteredApplications?.length} resultater</p>
    </div>
  );
};

export default ApplicantTable;

import toast from "react-hot-toast";
import { DeepPartial, periodType } from "../types/types";

export const validatePeriod = (
  periodData: DeepPartial<periodType>
): boolean => {
  const appStart = periodData.applicationPeriod?.start;
  const appEnd = periodData.applicationPeriod?.end;
  const intStart = periodData.interviewPeriod?.start;
  const intEnd = periodData.interviewPeriod?.end;
  const committees = periodData.committees;
  const optionalCommittees = periodData.optionalCommittees;

  // Check for undefined or empty fields
  if (!periodData.name || !appStart || !appEnd || !intStart || !intEnd) {
    toast.error("Alle feltene må fylles ut.");
    return false;
  }

  if (appEnd > intStart) {
    toast.error("Søknadsperioden må slutte før intervjuperioden starter.");
    return false;
  }

  // Check for overlapping dates within the same period
  if (appStart > appEnd || intStart > intEnd) {
    toast.error("Startdatoer må være før sluttdatoer.");
    return false;
  }

  // Check for at least one committee
  if (
    periodData.committees?.length === 0 &&
    periodData.optionalCommittees?.length === 0
  ) {
    toast.error("Minst én komité må velges.");
    return false;
  }

  // Check if any optional committees are present in committees
  if (
    optionalCommittees?.some(
      (optionalCommittee) => committees?.includes(optionalCommittee)
    )
  ) {
    toast.error("Valgte komitéer inneholder en eller flere valgfrie komitéer.");
    return false;
  }

  // If all checks pass
  return true;
};

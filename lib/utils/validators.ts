import { applicantType } from "../types/types";

export const isApplicantType = (data: any): data is applicantType => {
  console.log("data");
  console.log(data);
  // Check for each basic property type
  const hasBasicFields =
    typeof data.owId === "string" &&
    typeof data.name === "string" &&
    typeof data.email === "string" &&
    typeof data.phone === "string" &&
    typeof data.grade === "string" &&
    typeof data.about === "string" &&
    typeof data.bankom === "string" &&
    (data.bankom === "yes" ||
      data.bankom === "no" ||
      data.bankom === "maybe") &&
    typeof data.feminIt === "string" &&
    (data.feminIt === "yes" || data.feminIt === "no") &&
    (typeof data.periodId === "string" || typeof data.periodId === "object") &&
    data.date instanceof Date;

  // Check that the preferences object exists and contains the required fields
  const hasPreferencesFields =
    data.preferences &&
    typeof data.preferences.first === "string" &&
    typeof data.preferences.second === "string" &&
    typeof data.preferences.third === "string" &&
    // Ensure that non-empty preferences are unique
    (data.preferences.first === "" ||
      data.preferences.first !== data.preferences.second) &&
    (data.preferences.first === "" ||
      data.preferences.first !== data.preferences.third) &&
    (data.preferences.second === "" ||
      data.preferences.second !== data.preferences.third);

  // Check that the selectedTimes array is valid
  const hasSelectedTimesFields =
    Array.isArray(data.selectedTimes) &&
    data.selectedTimes.every(
      (time: { start: any; end: any }) =>
        typeof time.start === "string" && typeof time.end === "string"
    );

  // Combine all checks to determine if the data conforms to the applicantType
  return hasBasicFields && hasPreferencesFields /* && hasSelectedTimesFields */;
  // TODO: Uncomment the last check when the selectedTimes field is added to the applicantType
};

import { applicantType, commiteeType, periodType } from "../types/types";

export const isApplicantType = (data: any): data is applicantType => {
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

  const hasOptionalFields =
    data.optionalCommittees &&
    Array.isArray(data.optionalCommittees) &&
    data.optionalCommittees.every(
      (committee: any) => typeof committee === "string"
    );

  // Combine all checks to determine if the data conforms to the applicantType
  return hasBasicFields && hasPreferencesFields && hasOptionalFields;

  /* && hasSelectedTimesFields */
  // TODO: Uncomment the last check when the selectedTimes field is added to the applicantType
};

export const isCommitteeType = (data: any): data is commiteeType => {
  console.log(data);
  const hasBasicFields =
    typeof data.period_name === "string" &&
    typeof data.committee === "string" &&
    typeof data.timeslot === "string" &&
    Array.isArray(data.availabletimes) &&
    data.availabletimes.every(
      (time: { start: string; end: string }) =>
        typeof time.start === "string" && typeof time.end === "string"
    );

  return hasBasicFields;
};
export const isPeriodType = (data: any): data is periodType => {
  const isDateString = (str: any): boolean => {
    return typeof str === "string" && !isNaN(Date.parse(str));
  };

  const isValidPeriod = (period: any): boolean => {
    return (
      typeof period === "object" &&
      period !== null &&
      isDateString(period.start) &&
      isDateString(period.end)
    );
  };

  const isChronological = (start: string, end: string): boolean => {
    return new Date(start) <= new Date(end);
  };

  const arePeriodsValid = (
    preparationPeriod: any,
    applicationPeriod: any,
    interviewPeriod: any
  ): boolean => {
    return (
      isChronological(preparationPeriod.start, preparationPeriod.end) &&
      isChronological(applicationPeriod.start, applicationPeriod.end) &&
      isChronological(interviewPeriod.start, interviewPeriod.end) &&
      new Date(preparationPeriod.end) <= new Date(applicationPeriod.start) &&
      new Date(applicationPeriod.end) <= new Date(interviewPeriod.start)
    );
  };

  const hasBasicFields =
    typeof data.name === "string" &&
    typeof data.description === "string" &&
    isValidPeriod(data.preparationPeriod) &&
    isValidPeriod(data.applicationPeriod) &&
    isValidPeriod(data.interviewPeriod) &&
    Array.isArray(data.committees) &&
    data.committees.every((committee: any) => typeof committee === "string") &&
    arePeriodsValid(
      data.preparationPeriod,
      data.applicationPeriod,
      data.interviewPeriod
    );

  return hasBasicFields;
};

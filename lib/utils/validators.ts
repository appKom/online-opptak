import {
  applicantType,
  commiteeType,
  periodType,
  preferencesType,
} from "../types/types";

export const isApplicantType = (
  data: applicantType,
  period: periodType
): data is applicantType => {
  // Check for each basic property type
  const periodIdStr =
    typeof data.periodId === "object"
      ? data.periodId.toString()
      : data.periodId;
  const periodIdFromPeriodStr = period._id.toString();

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
    periodIdStr === periodIdFromPeriodStr &&
    data.date instanceof Date;

  // Check that the preferences object exists and contains the required fields
  const committees = period.committees.map((committee) =>
    committee.toLowerCase()
  );
  const optionalCommittees = period.optionalCommittees.map((committee) =>
    committee.toLowerCase()
  );

  const { first, second, third } = data.preferences as preferencesType;

  const hasPreferencesFields =
    (data.preferences as preferencesType) &&
    typeof first === "string" &&
    (typeof second === "string" || second === "") &&
    (typeof third === "string" || third === "") &&
    // Ensure that non-empty preferences are unique
    first !== second &&
    (first === "" || first !== third) &&
    (second === "" || second !== third) &&
    // Ensure preferences are in period committees or empty
    committees.includes(first) &&
    (second === "" || committees.includes(second)) &&
    (third === "" || committees.includes(third));

  // Check that the selectedTimes array is valid

  const hasSelectedTimes =
    Array.isArray(data.selectedTimes) &&
    data.selectedTimes.every(
      (time: { start: any; end: any }) =>
        typeof time.start === "string" &&
        typeof time.end === "string" &&
        new Date(time.start) >= new Date(period.interviewPeriod.start) &&
        new Date(time.start) <= new Date(period.interviewPeriod.end) &&
        new Date(time.end) <= new Date(period.interviewPeriod.end) &&
        new Date(time.end) >= new Date(period.interviewPeriod.start)
    );

  const hasOptionalFields =
    data.optionalCommittees &&
    Array.isArray(data.optionalCommittees) &&
    data.optionalCommittees.every(
      (committee: any) =>
        typeof committee === "string" && optionalCommittees.includes(committee)
    );

  return (
    hasBasicFields &&
    hasPreferencesFields &&
    hasOptionalFields &&
    hasSelectedTimes
  );
};

export const isCommitteeType = (data: any): data is commiteeType => {
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
    applicationPeriod: any,
    interviewPeriod: any
  ): boolean => {
    return (
      isChronological(applicationPeriod.start, applicationPeriod.end) &&
      isChronological(interviewPeriod.start, interviewPeriod.end) &&
      new Date(applicationPeriod.end) <= new Date(interviewPeriod.start)
    );
  };

  const hasBasicFields =
    typeof data.name === "string" &&
    typeof data.description === "string" &&
    isValidPeriod(data.applicationPeriod) &&
    isValidPeriod(data.interviewPeriod) &&
    Array.isArray(data.committees) &&
    data.committees.every((committee: any) => typeof committee === "string") &&
    arePeriodsValid(data.applicationPeriod, data.interviewPeriod);

  return hasBasicFields;
};

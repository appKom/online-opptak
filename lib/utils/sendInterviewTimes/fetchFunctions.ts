import {
  committeeEmails,
  committeeInterviewType,
  periodType,
} from "../../types/types";

export const fetchPeriod = async (periodId: string): Promise<periodType> => {
  try {
    const response = await fetch(`/api/periods/${periodId}`);
    const data = await response.json();
    if (!data || !data.period) {
      throw new Error("Invalid response from fetchPeriod");
    }
    return data.period;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch period");
  }
};

export const fetchCommitteeInterviewTimes = async (
  periodId: string
): Promise<committeeInterviewType[]> => {
  try {
    const response = await fetch(`/api/committees/times/${periodId}`);
    const data = await response.json();
    return data.committees.committees;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch committee interview times");
  }
};

export const fetchCommitteeEmails = async (): Promise<committeeEmails[]> => {
  try {
    const response = await fetch(`/api/periods/ow-committees`);
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error(
        "Expected an array from the fetchCommitteeEmails API response"
      );
    }
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch committee emails");
  }
};

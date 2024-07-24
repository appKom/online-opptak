import {
  algorithmType,
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

export const fetchAlgorithmData = async (
  periodId: string
): Promise<algorithmType[]> => {
  try {
    const reponse = await fetch(`/api/interviews/${periodId}`);
    const data = await reponse.json();
    if (!Array.isArray(data.interviews.interviews)) {
      throw new Error("Expected an array from the interviews API response");
    }
    return data.interviews.interviews;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch algorithm data");
  }
};

import { QueryFunctionContext } from "@tanstack/react-query";
import { applicationType } from "../types/types";

export const fetchApplicationByPeriodAndId = async (
  context: QueryFunctionContext
) => {
  const periodId = context.queryKey[1];
  const applicationId = context.queryKey[2];
  return fetch(`/api/applications/${periodId}/${applicationId}`).then((res) =>
    res.json()
  );
};

export const fetchApplicationsByPeriodId = async (
  context: QueryFunctionContext
) => {
  const periodId = context.queryKey[1];
  return fetch(`/api/applications/${periodId}`).then((res) => res.json());
};

export const fetchApplicationsByPeriodIdAndCommittee = async (
  context: QueryFunctionContext
) => {
  const periodId = context.queryKey[1];
  const committee = context.queryKey[2];
  return fetch(`/api/committees/applications/${periodId}/${committee}`).then(
    (res) => res.json()
  );
};

export const createApplication = async (application: applicationType) => {
  const response = await fetch(`/api/applications/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Unknown error occurred");
  }
  return data;
};

export const deleteApplication = async ({
  periodId,
  owId,
}: {
  periodId: string;
  owId: string;
}) => {
  const response = await fetch(`/api/applications/${periodId}/${owId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete the application");
  }

  return response;
};

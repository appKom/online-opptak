import { QueryFunctionContext } from "@tanstack/react-query";

export const fetchApplicantByPeriodAndId = async (
  context: QueryFunctionContext
) => {
  const periodId = context.queryKey[1];
  const applicantId = context.queryKey[2];
  return fetch(`/api/applicants/${periodId}/${applicantId}`).then((res) =>
    res.json()
  );
};

export const fetchApplicantsByPeriodId = async (
  context: QueryFunctionContext
) => {
  const periodId = context.queryKey[1];
  return fetch(`/api/applicants/${periodId}`).then((res) => res.json());
};

export const fetchApplicantsByPeriodIdAndCommittee = async (
  context: QueryFunctionContext
) => {
  const periodId = context.queryKey[1];
  const committee = context.queryKey[2];
  return fetch(`/api/committees/applicants/${periodId}/${committee}`).then(
    (res) => res.json()
  );
};

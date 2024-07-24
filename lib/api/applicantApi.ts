import { QueryFunctionContext } from '@tanstack/react-query';

export const fetchApplicantByPeriodAndId = async (context: QueryFunctionContext) => {
  const periodId = context.queryKey[1];
  const applicantId = context.queryKey[2];
  return fetch(`/api/applicants/${periodId}/${applicantId}`).then(res =>
    res.json()
  );
}

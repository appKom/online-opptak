import { QueryFunctionContext } from '@tanstack/react-query';

export const fetchPeriodById = async (context: QueryFunctionContext) => {
  const id = context.queryKey[1];
  return fetch(`/api/periods/${id}`).then(res =>
    res.json()
  );
}

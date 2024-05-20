export const toUTCString = (localDateStr: string): string => {
  const localDate = new Date(localDateStr);
  return new Date(
    localDate.getTime() - localDate.getTimezoneOffset() * 60000
  ).toISOString();
};

export const toLocalString = (utcDateStr: string): string => {
  const utcDate = new Date(utcDateStr);
  return new Date(
    utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
  ).toISOString();
};

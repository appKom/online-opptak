export const formatDate = (inputDate: undefined | Date) => {
  const date = new Date(inputDate || "");

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}.${month}.${year}`; //  - ${hours}:${minutes}
};

export const formatDateHours = (inputDate: undefined | Date) => {
  const date = new Date(inputDate || "");

  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  return `${formatDateNorwegian(inputDate)}, ${hours}:${minutes}`;
};

export const formatDateForSMS = (
  start: undefined | Date,
  end: undefined | Date
) => {
  const startDate = new Date(start || "");
  const endDate = new Date(end || "");

  const startHour = startDate.getHours().toString().padStart(2, "0");
  const startMinute = startDate.getMinutes().toString().padStart(2, "0");
  const endHour = endDate.getHours().toString().padStart(2, "0");
  const endMinute = endDate.getMinutes().toString().padStart(2, "0");

  return `${formatDateNorwegian(
    startDate
  )}, ${startHour}:${startMinute} til ${endHour}:${endMinute}`; //  - ${hours}:${minutes}
};

export const formatDateNorwegian = (inputDate?: Date): string => {
  const date = new Date(inputDate || "");

  const day = date.getDate().toString().padStart(2, "0");
  const monthsNorwegian = [
    "jan",
    "feb",
    "mar",
    "apr",
    "mai",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "des",
  ];
  const month = monthsNorwegian[date.getMonth()];

  return `${day}. ${month}`;
};

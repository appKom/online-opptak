export const formatDate = (inputDate: undefined | Date) => {
  const date = new Date(inputDate || "");

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}.${month}.${year}`; //  - ${hours}:${minutes}
};

export const formatDateHours = (
  start: undefined | string,
  end: undefined | string
) => {
  const startDate = start ? new Date(Date.parse(start)) : undefined;
  const endDate = end ? new Date(Date.parse(end)) : undefined;

  const startHour =
    startDate?.getUTCHours().toString().padStart(2, "0") || "00";
  const startMinute =
    startDate?.getUTCMinutes().toString().padStart(2, "0") || "00";
  const endHour = endDate?.getUTCHours().toString().padStart(2, "0") || "00";
  const endMinute =
    endDate?.getUTCMinutes().toString().padStart(2, "0") || "00";

  return `${formatDateNorwegian(
    startDate
  )}, ${startHour}:${startMinute} til ${endHour}:${endMinute}`;
};

export const formatDateNorwegian = (inputDate?: Date | string): string => {
  if (!inputDate) return "";

  let date: Date;
  if (inputDate instanceof Date) {
    date = inputDate;
  } else {
    date = new Date(inputDate);
    if (isNaN(date.getTime())) {
      return "";
    }
  }

  const day = date.getUTCDate().toString().padStart(2, "0");
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
  const month = monthsNorwegian[date.getUTCMonth()];

  return `${day}. ${month}`;
};

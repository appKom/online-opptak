export const formatDate = (inputDate: undefined | Date) => {
  const date = new Date(inputDate || "");

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}.${month}.${year}`; //  - ${hours}:${minutes}
};

export const formatDateNorwegian = (inputDate?: Date): string => {
  const date = new Date(inputDate || "");

  const day = date.getDate().toString().padStart(2, "0");
  const monthsNorwegian = [
    "jan",
    "feb",
    "mars",
    "april",
    "mai",
    "juni",
    "juli",
    "aug",
    "sep",
    "okt",
    "nov",
    "des",
  ];
  const month = monthsNorwegian[date.getMonth()];

  return `${day}. ${month}`;
};

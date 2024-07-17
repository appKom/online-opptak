export const getBankomValue = (bankom: "yes" | "no" | "maybe" | undefined) => {
  switch (bankom) {
    case "yes":
      return "Ja";
    case "maybe":
      return "Kanskje";
    case "no":
      return "Nei";
    default:
      return "Ikke valgt";
  }
};

export const changeDisplayName = (committee: string) => {
  if (committee.toLowerCase() === "kjelleren") {
    return "Realfagskjelleren";
  }
  return committee.charAt(0).toUpperCase() + committee.slice(1);
};

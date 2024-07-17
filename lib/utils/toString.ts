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

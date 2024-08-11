import toast from "react-hot-toast";
import validator from "validator";

export const validateApplication = (applicationData: any) => {
  // Check if email is valid
  if (!validator.isEmail(applicationData.email)) {
    toast.error("Fyll inn en gyldig e-postadresse");
    return false;
  }

  // Check if ntnu email is used
  if (applicationData.email.includes("ntnu.no")) {
    toast.error(
      "Vi har problemer med å sende e-post til NTNU e-poster. Vennligst bruk en annen e-postadresse."
    );
    return false;
  }

  // Check if phone number is valid
  if (!validator.isMobilePhone(applicationData.phone, "nb-NO")) {
    toast.error("Fyll inn et gyldig mobilnummer");
    return false;
  }

  // Check if grade is valid
  if (applicationData.grade == 0) {
    toast.error("Velg et trinn");
    return false;
  }

  // Check if about section is filled
  if (applicationData.about === "") {
    toast.error("Skriv litt om deg selv");
    return false;
  }

  // Check if at least one preference is selected
  if (
    !applicationData.preferences.first &&
    !applicationData.preferences.second &&
    !applicationData.preferences.third
  ) {
    toast.error("Velg minst én komité");
    return false;
  }

  // Check for duplicate committee preferences
  const { first, second, third } = applicationData.preferences;
  if (
    (first && second && first === second) ||
    (first && third && first === third) ||
    (second && third && second === third)
  ) {
    toast.error("Du kan ikke velge samme komité flere ganger");
    return false;
  }

  // Check if Bankom interest is specified
  if (applicationData.bankom === undefined) {
    toast.error("Velg om du er interessert i Bankom");
    return false;
  }

  for (const time of applicationData.selectedTimes) {
    const startTime = new Date(time.start);
    const endTime = new Date(time.end);
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      toast.error("Ugyldig start- eller sluttid");
      return false;
    }
    if (startTime >= endTime) {
      toast.error("Starttid må være før sluttid");
      return false;
    }
  }

  return true;
};

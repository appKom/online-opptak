import { applicantType, emailDataType } from "../types/types";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";
import { changeDisplayName } from "../utils/toString";
import { generateApplicantEmail } from "./applicantEmailTemplate";
import sendEmail from "./sendEmail";

export const sendConfirmationEmail = async (applicant: applicantType) => {
  let optionalCommitteesString = "";
  if (applicant.optionalCommittees.length > 0) {
    optionalCommitteesString = applicant.optionalCommittees
      ?.map(changeDisplayName)
      .join(", ");
  } else {
    optionalCommitteesString = "Ingen";
  }

  const emailData: emailDataType = {
    name: applicant.name,
    emails: [applicant.email],
    phone: applicant.phone,
    grade: applicant.grade,
    about: applicant.about.replace(/\n/g, "<br>"),
    firstChoice: "Tom",
    secondChoice: "Tom",
    thirdChoice: "Tom",
    bankom:
      applicant.bankom == "ja"
        ? "Ja"
        : applicant.bankom == "nei"
        ? "Nei"
        : "Kanskje",
    optionalCommittees: optionalCommitteesString,
  };

  //Type guard
  if (!Array.isArray(applicant.preferences)) {
    emailData.firstChoice =
      applicant.preferences.first == "onlineil"
        ? "Online IL"
        : capitalizeFirstLetter(applicant.preferences.first);
    emailData.secondChoice =
      applicant.preferences.second == "onlineil"
        ? "Online IL"
        : capitalizeFirstLetter(applicant.preferences.second);
    emailData.thirdChoice =
      applicant.preferences.third == "onlineil"
        ? "Online IL"
        : capitalizeFirstLetter(applicant.preferences.third);
  }

  try {
    await sendEmail({
      toEmails: emailData.emails,
      subject: "Vi har mottatt din søknad!",
      htmlContent: generateApplicantEmail(emailData),
    });
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};

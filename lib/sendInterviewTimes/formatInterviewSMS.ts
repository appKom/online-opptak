import { emailApplicantInterviewType } from "../types/types";
import { formatDateHours } from "../utils/dateUtils";
import { changeDisplayName } from "../utils/toString";

export const formatInterviewSMS = (applicant: emailApplicantInterviewType) => {
  let phoneBody = `Hei ${applicant.applicantName}, her er dine intervjutider for ${applicant.period_name}: \n \n`;

  applicant.committees.sort((a, b) => {
    return (
      new Date(a.interviewTime.start).getTime() -
      new Date(b.interviewTime.start).getTime()
    );
  });

  applicant.committees.forEach((committee) => {
    phoneBody += `Komite: ${changeDisplayName(committee.committeeName)} \n`;

    if (committee.interviewTime.start !== "Ikke satt") {
      phoneBody += `Tid: ${formatDateHours(
        new Date(committee.interviewTime.start),
        new Date(committee.interviewTime.end)
      )}\n`;
    }

    if (committee.interviewTime.start === "Ikke satt") {
      phoneBody += `Tid: Ikke satt \n`;
    }

    phoneBody += `Rom: ${committee.interviewTime.room} \n \n`;
  });

  phoneBody += `Skjedd en feil? Ta kontakt med appkom@online.ntnu.no`;

  return phoneBody;
};

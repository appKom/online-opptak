import { emailApplicantInterviewType } from "../../types/types";
import { formatDateHours } from "../dateUtils";
import { changeDisplayName } from "../toString";

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
    phoneBody += `Start: ${formatDateHours(
      new Date(committee.interviewTime.start)
    )}\n`;
    phoneBody += `Slutt: ${formatDateHours(
      new Date(committee.interviewTime.end)
    )}\n`;
    phoneBody += `Rom: ${committee.interviewTime.room} \n \n`;
  });

  phoneBody += `Skjedd en feil? Ta kontakt med Appkom`;

  return phoneBody;
};

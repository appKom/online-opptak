import {
  emailApplicantInterviewType,
  emailCommitteeInterviewType,
} from "../../types/types";
import { formatDateHours } from "../dateUtils";
import { changeDisplayName } from "../toString";

export const formatApplicantInterviewEmail = (
  applicant: emailApplicantInterviewType
) => {
  let emailBody = `<p>Hei <strong>${applicant.applicantName}</strong>,</p><p>Her er dine intervjutider for ${applicant.period_name}:</p><ul><br/>`;

  applicant.committees.sort((a, b) => {
    return (
      new Date(a.interviewTime.start).getTime() -
      new Date(b.interviewTime.start).getTime()
    );
  });

  applicant.committees.forEach((committee) => {
    emailBody += `<li><b>Komite:</b> ${changeDisplayName(
      committee.committeeName
    )}<br>`;
    emailBody += `<b>Start:</b> ${formatDateHours(
      committee.interviewTime.start
    )}<br>`;
    emailBody += `<b>Slutt:</b> ${formatDateHours(
      committee.interviewTime.end
    )}<br>`;
    emailBody += `<b>Rom:</b> ${committee.interviewTime.room}</li><br>`;
  });

  emailBody += `</ul> <br/> <br/> <p>Skjedd en feil? Ta kontakt med <a href="mailto:appkom@online.ntnu.no">Appkom</a>❤️</p>`;

  return emailBody;
};

export const formatCommitteeInterviewEmail = (
  committee: emailCommitteeInterviewType
) => {
  let emailBody = `<p>Hei <strong>${changeDisplayName(
    committee.committeeName
  )}</strong>,</p><p>Her er deres intervjutider:</p><ul>`;

  committee.applicants.sort((a, b) => {
    return (
      new Date(a.interviewTime.start).getTime() -
      new Date(b.interviewTime.start).getTime()
    );
  });

  committee.applicants.forEach((applicant) => {
    emailBody += `<li><b>Navn:</b> ${applicant.applicantName}<br>`;
    emailBody += `<b>Telefon:</b> ${applicant.applicantPhone} <br> `;
    emailBody += `<b>Start:</b> ${formatDateHours(
      applicant.interviewTime.start
    )}<br>`;
    emailBody += `<b>Slutt:</b> ${formatDateHours(
      applicant.interviewTime.end
    )}<br>`;
    emailBody += `<b>Rom:</b> ${applicant.interviewTime.room}</li><br>`;
  });

  emailBody += `</ul> <br/> <br/> <p>Skjedd en feil? Ta kontakt med <a href="mailto:appkom@online.ntnu.no">Appkom</a>❤️</p>`;

  return emailBody;
};

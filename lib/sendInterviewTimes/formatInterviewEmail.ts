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

    if (committee.interviewTime.start !== "Ikke satt") {
      emailBody += `<b>Start:</b> ${formatDateHours(
        new Date(committee.interviewTime.start)
      )}<br>`;
      emailBody += `<b>Slutt:</b> ${formatDateHours(
        new Date(committee.interviewTime.end)
      )}<br>`;
    }
    if (committee.interviewTime.start === "Ikke satt") {
      emailBody += `<b>Start:</b> Ikke satt<br>`;
      emailBody += `<b>Slutt:</b> Ikke satt<br>`;
    }

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

    if (applicant.interviewTime.start !== "Ikke satt") {
      emailBody += `<b>Start:</b> ${formatDateHours(
        new Date(applicant.interviewTime.start)
      )}<br>`;
      emailBody += `<b>Slutt:</b> ${formatDateHours(
        new Date(applicant.interviewTime.end)
      )}<br>`;
    }

    if (applicant.interviewTime.start === "Ikke satt") {
      emailBody += `<b>Start:</b> Ikke satt<br>`;
      emailBody += `<b>Slutt:</b> Ikke satt<br>`;
    }
    emailBody += `<b>Rom:</b> ${applicant.interviewTime.room}</li><br>`;
  });

  emailBody += `</ul> <br/> <br/> <p>Skjedd en feil? Ta kontakt med <a href="mailto:appkom@online.ntnu.no">Appkom</a>❤️</p>`;

  return emailBody;
};

import { SESClient } from "@aws-sdk/client-ses";
import {
  emailCommitteeInterviewType,
  emailApplicantInterviewType,
} from "../../types/types";
import { changeDisplayName } from "../toString";
import { formatDateHours } from "../dateUtils";
import sendEmail from "../sendEmail";
import sendSMS from "./sendSMS";

interface sendInterviewTimesProps {
  committeesToEmail: emailCommitteeInterviewType[];
  applicantsToEmail: emailApplicantInterviewType[];
}

export const formatAndSendEmails = async ({
  committeesToEmail,
  applicantsToEmail,
}: sendInterviewTimesProps) => {
  try {
    const sesClient = new SESClient({ region: "eu-north-1" });

    // Send email to each applicant
    if (applicantsToEmail.length > 0) {
      const typedApplicant: emailApplicantInterviewType = applicantsToEmail[0];
      const applicantEmail = [typedApplicant.applicantEmail];
      const subject = `Hei, ${typedApplicant.applicantName}, her er dine intervjutider:`;

      let emailBody = `<p>Hei <strong>${typedApplicant.applicantName}</strong>,</p><p>Her er dine intervjutider for ${typedApplicant.period_name}:</p><ul><br/>`;
      let phoneBody = `Hei ${typedApplicant.applicantName}, her er dine intervjutider for ${typedApplicant.period_name}: \n \n`;

      typedApplicant.committees.sort((a, b) => {
        return (
          new Date(a.interviewTime.start).getTime() -
          new Date(b.interviewTime.start).getTime()
        );
      });

      typedApplicant.committees.forEach((committee) => {
        emailBody += `<li><b>Komite:</b> ${changeDisplayName(
          committee.committeeName
        )}<br>`;
        emailBody += `<b>Start:</b> ${formatDateHours(
          new Date(committee.interviewTime.start)
        )}<br>`;
        emailBody += `<b>Slutt:</b> ${formatDateHours(
          new Date(committee.interviewTime.end)
        )}<br>`;
        emailBody += `<b>Rom:</b> ${committee.interviewTime.room}</li><br>`;

        phoneBody += `Komite: ${changeDisplayName(committee.committeeName)} \n`;
        phoneBody += `Start: ${formatDateHours(
          new Date(committee.interviewTime.start)
        )}\n`;
        phoneBody += `Slutt: ${formatDateHours(
          new Date(committee.interviewTime.end)
        )}\n`;
        phoneBody += `Rom: ${committee.interviewTime.room} \n \n`;
      });

      emailBody += `</ul> <br/> <br/> <p>Skjedd en feil? Ta kontakt med <a href="mailto:appkom@online.ntnu.no">Appkom</a>❤️</p>`;
      phoneBody += `Skjedd en feil? Ta kontakt med Appkom❤️`;

      // await sendEmail({
      //   sesClient: sesClient,
      //   fromEmail: "opptak@online.ntnu.no",
      //   toEmails: applicantEmail,
      //   subject: subject,
      //   htmlContent: emailBody,
      // });

      let toPhoneNumber = "+47";
      toPhoneNumber += typedApplicant.applicantPhone;
      sendSMS(toPhoneNumber, phoneBody);

      console.log(applicantEmail[0], "\n", subject, "\n", emailBody);
    }

    // Send email to each committee
    for (const committee of committeesToEmail) {
      const typedCommittee: emailCommitteeInterviewType = committeesToEmail[0];
      const committeeEmail = [typedCommittee.committeeEmail];
      const subject = `${changeDisplayName(
        typedCommittee.committeeName
      )} sine intervjutider for ${typedCommittee.period_name}`;

      let body = `<p>Hei <strong>${changeDisplayName(
        typedCommittee.committeeName
      )}</strong>,</p><p>Her er deres intervjutider:</p><ul>`;

      typedCommittee.applicants.sort((a, b) => {
        return (
          new Date(a.interviewTime.start).getTime() -
          new Date(b.interviewTime.start).getTime()
        );
      });

      typedCommittee.applicants.forEach((applicant) => {
        body += `<li><b>Navn:</b> ${applicant.applicantName}<br>`;
        body += `<b>Start:</b> ${formatDateHours(
          new Date(applicant.interviewTime.start)
        )}<br>`;
        body += `<b>Slutt:</b> ${formatDateHours(
          new Date(applicant.interviewTime.end)
        )}<br>`;
        body += `<b>Rom:</b> ${applicant.interviewTime.room}</li><br>`;
      });

      body += `</ul> <br/> <br/> <p>Skjedd en feil? Ta kontakt med <a href="mailto:appkom@online.ntnu.no">Appkom</a>❤️</p>`;

      // await sendEmail({
      //   sesClient: sesClient,
      //   fromEmail: "opptak@online.ntnu.no",
      //   toEmails: committeeEmail,
      //   subject: subject,
      //   htmlContent: body,
      // });

      console.log(committeeEmail[0], "\n", subject, "\n", body);
    }
  } catch (error) {
    return { error: "Failed to send out interview times" };
  }
};

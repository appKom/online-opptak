import { SESClient } from "@aws-sdk/client-ses";
import {
  emailCommitteeInterviewType,
  emailApplicantInterviewType,
} from "../../types/types";
import { changeDisplayName } from "../toString";

interface sendInterviewTimesProps {
  committeesToEmail: emailCommitteeInterviewType[];
  applicantsToEmail: emailApplicantInterviewType[];
}

export const formatAndSendEmails = async ({
  committeesToEmail,
  applicantsToEmail,
}: sendInterviewTimesProps) => {
  const sesClient = new SESClient({ region: "eu-north-1" });

  // Send email to each applicant
  for (const applicant of applicantsToEmail) {
    const typedApplicant: emailApplicantInterviewType = applicant;
    const applicantEmail = [typedApplicant.applicantEmail];
    const subject = `Hei, ${typedApplicant.applicantName}. Her er dine intervjutider:`;
    let body = `\n\n`;

    typedApplicant.committees.forEach((committee) => {
      body += `Komite: ${committee.committeeName}\n`;
      body += `Start: ${committee.interviewTime.start}\n`;
      body += `Slutt: ${committee.interviewTime.end}\n`;
      body += `Rom: ${committee.interviewTime.room}\n\n`;
    });

    body += `Med vennlig hilsen,\nAppkom <3`;

    //   // await sendEmail({
    //   //   sesClient: sesClient,
    //   //   fromEmail: "opptak@online.ntnu.no",
    //   //   toEmails: applicantEmail,
    //   //   subject: subject,
    //   //   htmlContent: body,
    //   // });

    console.log(applicantEmail[0], "\n", subject, "\n", body);
  }

  // Send email to each committee
  for (const committee of committeesToEmail) {
    const typedCommittee: emailCommitteeInterviewType = committee;
    const committeeEmail = [typedCommittee.committeeEmail];
    const subject = `${changeDisplayName(
      typedCommittee.committeeName
    )}s sine intervjutider for ${typedCommittee.period_name}`;
    let body = `Her er intervjutidene for søkerene deres:\n\n`;

    typedCommittee.applicants.forEach((applicant) => {
      body += `Navn: ${applicant.applicantName}\n`;
      body += `Start: ${applicant.interviewTime.start}\n`;
      body += `Slutt: ${applicant.interviewTime.end}\n`;
      body += `Rom: ${applicant.interviewTime.room}\n\n`;
    });

    body += `Med vennlig hilsen, Appkom <3`;

    // await sendEmail({
    //   sesClient: sesClient,
    //   fromEmail: "opptak@online.ntnu.no",
    //   toEmails: committeeEmail,
    //   subject: subject,
    //   htmlContent: body,
    // });

    console.log(committeeEmail[0], "\n", subject, "\n", body);
  }
};

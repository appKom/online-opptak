import { SESClient } from "@aws-sdk/client-ses";
import sendEmail from "./sendEmail";
import {
  emailApplicantInterviewType,
  emailCommitteeInterviewType,
} from "../types/types";

import { algorithmTestData } from "./tempEmailTestData";

interface Props {
  periodId: string;
}

export const fetchInterviewTimes = async ({ periodId }: Props) => {
  //TODO
  //Hente data fra algoritmen
  //Hente data fra databasen
  //Slå sammen dataen fra algoritmen og databasen
};

interface sendInterviewTimesProps {
  committeesToEmail: emailCommitteeInterviewType[];
  applicantsToEmail: emailApplicantInterviewType[];
}

const sendInterviewTimes = async ({
  committeesToEmail,
  applicantsToEmail,
}: sendInterviewTimesProps) => {
  const sesClient = new SESClient({ region: "eu-north-1" });

  // Send email to each applicant
  for (const applicant of applicantsToEmail) {
    const typedApplicant: emailApplicantInterviewType = applicant;
    const applicantEmail = [typedApplicant.applicantEmail];
    const subject = `Hei, ${typedApplicant.period_name}. Her er dine intervjutider!`;
    let body = `Intervjutider:\n\n`;

    typedApplicant.committees.forEach((committee: any) => {
      body += `Komite: ${committee.name}\n`;
      body += `Start: ${committee.interviewTimes.start}\n`;
      body += `Slutt: ${committee.interviewTimes.end}\n\n`;
    });

    body += `Med vennlig hilsen,\nAppkom <3`;

    await sendEmail({
      sesClient: sesClient,
      fromEmail: "opptak@online.ntnu.no",
      toEmails: applicantEmail,
      subject: subject,
      htmlContent: body,
    });
  }

  // Send email to each committee
  for (const committee of committeesToEmail) {
    const typedCommittee: emailCommitteeInterviewType = committee;
    const committeeEmail = [typedCommittee.committeeEmail];
    const subject = `${typedCommittee.period_name}s sine intervjutider`;
    let body = `Her er intervjutidene for søkerene deres:\n\n`;

    typedCommittee.applicants.forEach((applicant: any) => {
      body += `Navn: ${applicant.name}\n`;
      body += `Start: ${applicant.interviewTimes.start}\n`;
      body += `Slutt: ${applicant.interviewTimes.end}\n\n`;
    });

    body += `Med vennlig hilsen, Appkom <3`;

    await sendEmail({
      sesClient: sesClient,
      fromEmail: "opptak@online.ntnu.no",
      toEmails: committeeEmail,
      subject: subject,
      htmlContent: body,
    });
  }
};

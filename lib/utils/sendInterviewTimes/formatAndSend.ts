import { SESClient } from "@aws-sdk/client-ses";
import {
  emailCommitteeInterviewType,
  emailApplicantInterviewType,
} from "../../types/types";
import { changeDisplayName } from "../toString";
import { formatDateHours } from "../dateUtils";
import { sendEmailWithAttachments } from "../sendEmail"; // Adjust import if necessary
import { format } from "date-fns";

interface sendInterviewTimesProps {
  committeesToEmail: emailCommitteeInterviewType[];
  applicantsToEmail: emailApplicantInterviewType[];
}

const createICSFile = (
  summary: string,
  description: string,
  start: Date,
  end: Date,
  location: string
) => {
  const startTime = format(start, "yyyyMMdd'T'HHmmss'Z'");
  const endTime = format(end, "yyyyMMdd'T'HHmmss'Z'");
  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:Online Linjeforening
BEGIN:VEVENT
UID:${new Date().getTime()}
SUMMARY:${summary}
DESCRIPTION:${description}
DTSTART:${startTime}
DTEND:${endTime}
LOCATION:${location}
END:VEVENT
END:VCALENDAR
  `;
  return icsContent.trim();
};

export const formatAndSendEmails = async ({
  committeesToEmail,
  applicantsToEmail,
}: sendInterviewTimesProps) => {
  try {
    const sesClient = new SESClient({ region: "eu-north-1" });

    // Send email to each applicant
    for (const applicant of applicantsToEmail) {
      const typedApplicant: emailApplicantInterviewType = applicant;
      const applicantEmail = [typedApplicant.applicantEmail];
      const subject = `Hei, ${typedApplicant.applicantName}. Her er dine intervjutider:`;
      let body = `\n\n`;
      const attachments: any[] = [];

      typedApplicant.committees.forEach((committee) => {
        const summary = `Interview with ${changeDisplayName(
          committee.committeeName
        )}`;
        const description = `Interview with ${changeDisplayName(
          committee.committeeName
        )}`;
        const start = new Date(committee.interviewTime.start);
        const end = new Date(committee.interviewTime.end);
        const location = committee.interviewTime.room;
        const icsContent = createICSFile(
          summary,
          description,
          start,
          end,
          location
        );

        attachments.push({
          filename: `${committee.committeeName}-interview.ics`,
          content: icsContent,
          contentType: "text/calendar",
        });

        body += `Komite: ${changeDisplayName(committee.committeeName)}\n`;
        body += `Start: ${formatDateHours(start)}\n`;
        body += `Slutt: ${formatDateHours(end)}\n`;
        body += `Rom: ${location}\n\n`;
      });

      body += `Med vennlig hilsen,\nAppkom <3`;

      await sendEmailWithAttachments({
        sesClient: sesClient,
        fromEmail: "opptak@online.ntnu.no",
        toEmails: applicantEmail,
        subject: subject,
        htmlContent: body,
        attachments: attachments,
      });

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
        body += `Start: ${formatDateHours(
          new Date(applicant.interviewTime.start)
        )}\n`;
        body += `Slutt: ${formatDateHours(
          new Date(applicant.interviewTime.end)
        )}\n`;
        body += `Rom: ${applicant.interviewTime.room}\n\n`;
      });

      body += `Med vennlig hilsen, Appkom <3`;

      await sendEmailWithAttachments({
        sesClient: sesClient,
        fromEmail: "opptak@online.ntnu.no",
        toEmails: committeeEmail,
        subject: subject,
        htmlContent: body,
      });

      console.log(committeeEmail[0], "\n", subject, "\n", body);
    }
  } catch (error) {
    return { error: "Failed to send out interview times" };
  }
};

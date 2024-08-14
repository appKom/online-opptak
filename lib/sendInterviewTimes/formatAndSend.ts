import {
  emailCommitteeInterviewType,
  emailApplicantInterviewType,
} from "../types/types";

import sendEmail from "../email/sendEmail";
import sendSMS from "./sendSMS";
import {
  formatApplicantInterviewEmail,
  formatCommitteeInterviewEmail,
} from "./formatInterviewEmail";
import { formatInterviewSMS } from "./formatInterviewSMS";
import { changeDisplayName } from "../utils/toString";

interface sendInterviewTimesProps {
  committeesToEmail: emailCommitteeInterviewType[];
  applicantsToEmail: emailApplicantInterviewType[];
}

export const formatAndSendEmails = async ({
  committeesToEmail,
  applicantsToEmail,
}: sendInterviewTimesProps) => {
  try {
    // Send email to each applicant
    applicantsToEmail.forEach(
      async (applicant: emailApplicantInterviewType) => {
        await sendEmail({
          toEmails: [applicant.applicantEmail],
          subject: `Hei, ${applicant.applicantName}, her er dine intervjutider:`,
          htmlContent: formatApplicantInterviewEmail(applicant),
        });

        sendSMS(
          `+47${applicant.applicantPhone}`,
          formatInterviewSMS(applicant)
        );
      }
    );

    // Send email to each committee
    committeesToEmail.forEach(
      async (committee: emailCommitteeInterviewType) => {
        const committeeEmail = [committee.committeeEmail];
        const subject = `${changeDisplayName(
          committee.committeeName
        )} sine intervjutider for ${committee.period_name}`;

        const emailBody = formatCommitteeInterviewEmail(committee);

        await sendEmail({
          toEmails: committeeEmail,
          subject: subject,
          htmlContent: emailBody,
        });
      }
    );
  } catch (error) {
    return { error: "Failed to send out interview times" };
  }
};

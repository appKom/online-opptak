import {
  emailCommitteeInterviewType,
  emailApplicantInterviewType,
} from "../../types/types";
import { changeDisplayName } from "../toString";
import { formatDateHours } from "../dateUtils";
import sendEmail from "../../email/sendEmail";
import sendSMS from "./sendSMS";
import {
  formatApplicantInterviewEmail,
  formatCommitteeInterviewEmail,
} from "./formatInterviewEmail";
import { formatInterviewSMS } from "./formatInterviewSMS";

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
    for (const applicant of applicantsToEmail) {
      const typedApplicant: emailApplicantInterviewType = applicant;
      const applicantEmail = [typedApplicant.applicantEmail];
      const subject = `Hei, ${typedApplicant.applicantName}, her er dine intervjutider:`;

      const emailBody = formatApplicantInterviewEmail(typedApplicant);
      const phoneBody = formatInterviewSMS(typedApplicant);

      await sendEmail({
        toEmails: applicantEmail,
        subject: subject,
        htmlContent: emailBody,
      });

      let toPhoneNumber = "+47";
      toPhoneNumber += typedApplicant.applicantPhone;
      sendSMS(toPhoneNumber, phoneBody);
    }

    // Send email to each committee
    for (const committee of committeesToEmail) {
      const typedCommittee: emailCommitteeInterviewType = committee;
      const committeeEmail = [typedCommittee.committeeEmail];
      const subject = `${changeDisplayName(
        typedCommittee.committeeName
      )} sine intervjutider for ${typedCommittee.period_name}`;

      const emailBody = formatCommitteeInterviewEmail(typedCommittee);

      await sendEmail({
        toEmails: committeeEmail,
        subject: subject,
        htmlContent: emailBody,
      });
    }
  } catch (error) {
    return { error: "Failed to send out interview times" };
  }
};

import { SESClient } from "@aws-sdk/client-ses";
import sendEmail from "./sendEmail";
import {
  committeeEmails,
  committeeInterviewType,
  emailApplicantInterviewType,
  emailCommitteeInterviewType,
  periodType,
  algorithmType,
} from "../types/types";

import { algorithmTestData } from "./tempEmailTestData";

interface Props {
  periodId: string;
}

export const sendOutInterviewTimes = async ({ periodId }: Props) => {
  const period: periodType = await fetchPeriod(periodId);
  const committeeInterviewTimes: committeeInterviewType[] =
    await fetchCommitteeInterviewTimes(periodId);
  const committeeEmails: committeeEmails[] = await fetchCommitteeEmails();

  console.log("Period:", period);
  console.log("Committee Interview Times:", committeeInterviewTimes);
  console.log("Committee Emails:", committeeEmails);

  // TODO hente fra algoritmen
  const algorithmData: algorithmType = algorithmTestData;

  const committeesToEmail: emailCommitteeInterviewType[] = [];
  const applicantsToEmailMap: { [key: string]: emailApplicantInterviewType } =
    {};

  // Ensure committeeInterviewTimes is an array
  if (!Array.isArray(committeeInterviewTimes)) {
    throw new Error("committeeInterviewTimes is not an array");
  }

  // Merge data from algorithm and database
  for (const committeeTime of committeeInterviewTimes) {
    const committeeEmail = committeeEmails.find(
      (email) => email.committeeName === committeeTime.committee
    );

    if (!committeeEmail) continue;

    const applicants = algorithmData
      .filter((app) => app.committeeName === committeeTime.committee)
      .map((app) => ({
        committeeName: app.committeeName,
        committeeEmail: committeeEmail.committeeEmail,
        interviewTimes: {
          start: app.interviewTime.start,
          end: app.interviewTime.end,
          room:
            committeeTime.availabletimes.find(
              (time) =>
                time.start === app.interviewTime.start &&
                time.end === app.interviewTime.end
            )?.room || "",
        },
      }));

    const emailCommittee: emailCommitteeInterviewType = {
      periodId: period._id.toString(),
      period_name: period.name,
      committeeName: committeeTime.committee,
      committeeEmail: committeeEmail.committeeEmail,
      applicants,
    };

    committeesToEmail.push(emailCommittee);

    // Collect applicants to send email
    for (const applicant of applicants) {
      if (!applicantsToEmailMap[applicant.committeeEmail]) {
        applicantsToEmailMap[applicant.committeeEmail] = {
          periodId: period._id.toString(),
          period_name: period.name,
          applicantName: applicant.committeeName,
          applicantEmail: applicant.committeeEmail,
          committees: [],
        };
      }
      applicantsToEmailMap[applicant.committeeEmail].committees.push(applicant);
    }
  }

  const applicantsToEmail = Object.values(applicantsToEmailMap);

  console.log("Committees To Email:", committeesToEmail);
  console.log("Applicants To Email:", applicantsToEmail);

  // Send out the emails
  await formatAndSendEmails({ committeesToEmail, applicantsToEmail });
};

const fetchPeriod = async (periodId: string): Promise<periodType> => {
  try {
    const response = await fetch(`/api/periods/${periodId}`);
    const data = await response.json();
    if (!data || !data.period) {
      throw new Error("Invalid response from fetchPeriod");
    }
    return data.period;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch period");
  }
};

const fetchCommitteeInterviewTimes = async (
  periodId: string
): Promise<committeeInterviewType[]> => {
  try {
    const response = await fetch(`/api/committees/times/${periodId}`);
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error(
        "Expected an array from the fetchCommitteeInterviewTimes API response"
      );
    }
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch committee interview times");
  }
};

const fetchCommitteeEmails = async (): Promise<committeeEmails[]> => {
  try {
    const response = await fetch(`/api/periods/ow-committees`);
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error(
        "Expected an array from the fetchCommitteeEmails API response"
      );
    }
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch committee emails");
  }
};

interface sendInterviewTimesProps {
  committeesToEmail: emailCommitteeInterviewType[];
  applicantsToEmail: emailApplicantInterviewType[];
}

const formatAndSendEmails = async ({
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
      body += `Komite: ${committee.committeeName}\n`;
      body += `Start: ${committee.interviewTimes.start}\n`;
      body += `Slutt: ${committee.interviewTimes.end}\n`;
      body += `Rom: ${committee.interviewTimes.room}\n\n`;
    });

    body += `Med vennlig hilsen,\nAppkom <3`;

    // await sendEmail({
    //   sesClient: sesClient,
    //   fromEmail: "opptak@online.ntnu.no",
    //   toEmails: applicantEmail,
    //   subject: subject,
    //   htmlContent: body,
    // });

    console.log(
      "sesClient",
      sesClient,
      "fromEmail",
      "opptak@online.ntnu.no",
      "toEmails",
      applicantEmail,
      "subject",
      subject,
      "htmlContent",
      body
    );
  }

  // Send email to each committee
  for (const committee of committeesToEmail) {
    const typedCommittee: emailCommitteeInterviewType = committee;
    const committeeEmail = [typedCommittee.committeeEmail];
    const subject = `${typedCommittee.period_name}s sine intervjutider`;
    let body = `Her er intervjutidene for søkerene deres:\n\n`;

    typedCommittee.applicants.forEach((applicant: any) => {
      body += `Navn: ${applicant.committeeName}\n`;
      body += `Start: ${applicant.interviewTimes.start}\n`;
      body += `Slutt: ${applicant.interviewTimes.end}\n`;
      body += `Rom: ${applicant.interviewTimes.room}\n\n`;
    });

    body += `Med vennlig hilsen, Appkom <3`;

    // await sendEmail({
    //   sesClient: sesClient,
    //   fromEmail: "opptak@online.ntnu.no",
    //   toEmails: committeeEmail,
    //   subject: subject,
    //   htmlContent: body,
    // });

    console.log(
      "sesClient",
      sesClient,
      "fromEmail",
      "opptak@online.ntnu.no",
      "toEmails",
      committeeEmail,
      "subject",
      subject,
      "htmlContent",
      body
    );
  }
};

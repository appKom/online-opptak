import { SESClient } from "@aws-sdk/client-ses";
import sendEmail from "../sendEmail";
import {
  committeeEmails,
  committeeInterviewType,
  emailApplicantInterviewType,
  emailCommitteeInterviewType,
  periodType,
  algorithmType,
} from "../../types/types";

import { algorithmTestData } from "./tempEmailTestData";
import { changeDisplayName } from "../toString";
import {
  fetchCommitteeEmails,
  fetchCommitteeInterviewTimes,
  fetchPeriod,
} from "./fetchFunctions";

interface Props {
  periodId: string;
}

export const sendOutInterviewTimes = async ({ periodId }: Props) => {
  const period: periodType = await fetchPeriod(periodId);
  const committeeInterviewTimes: committeeInterviewType[] =
    await fetchCommitteeInterviewTimes(periodId);
  const committeeEmails: committeeEmails[] = await fetchCommitteeEmails();

  const algorithmData: algorithmType = algorithmTestData;

  const applicantsToEmailMap = formatApplicants(
    algorithmData,
    periodId,
    period,
    committeeEmails,
    committeeInterviewTimes
  );

  const committeesToEmail = formatCommittees(applicantsToEmailMap);

  console.log(applicantsToEmailMap);
  console.log(committeesToEmail);

  // await formatAndSendEmails({ committeesToEmail, applicantsToEmail });
};

const formatApplicants = (
  algorithmData: algorithmType,
  periodId: string,
  period: periodType,
  committeeEmails: committeeEmails[],
  committeeInterviewTimes: committeeInterviewType[]
): emailApplicantInterviewType[] => {
  const applicantsToEmailMap: emailApplicantInterviewType[] = [];

  for (const app of algorithmData) {
    const committees = app.interviews.map((interview) => {
      const committeeEmail = committeeEmails.find(
        (email) =>
          email.name_short.toLowerCase() ===
          interview.committeeName.toLowerCase()
      );

      const committeeTime = committeeInterviewTimes.find(
        (time) =>
          time.committee.toLowerCase() ===
            interview.committeeName.toLowerCase() &&
          time.availabletimes.some(
            (available) =>
              available.start === interview.start &&
              available.end === interview.end
          )
      );

      return {
        committeeName: interview.committeeName,
        committeeEmail: committeeEmail?.email || "",
        interviewTime: {
          start: interview.start,
          end: interview.end,
          room:
            committeeTime?.availabletimes.find(
              (available) =>
                available.start === interview.start &&
                available.end === interview.end
            )?.room || "",
        },
      };
    });

    const applicantToEmail: emailApplicantInterviewType = {
      periodId: periodId,
      period_name: period.name,
      applicantName: app.applicantName,
      applicantEmail: app.applicantEmail,
      committees: committees,
    };

    applicantsToEmailMap.push(applicantToEmail);
  }

  return applicantsToEmailMap;
};

const formatCommittees = (
  applicantsToEmailMap: emailApplicantInterviewType[]
): emailCommitteeInterviewType[] => {
  const committeesToEmail: { [key: string]: emailCommitteeInterviewType } = {};

  for (const applicant of applicantsToEmailMap) {
    for (const committee of applicant.committees) {
      if (!committeesToEmail[committee.committeeName]) {
        committeesToEmail[committee.committeeName] = {
          periodId: applicant.periodId,
          period_name: applicant.period_name,
          committeeName: committee.committeeName,
          committeeEmail: committee.committeeEmail,
          applicants: [],
        };
      }

      committeesToEmail[committee.committeeName].applicants.push({
        applicantName: applicant.applicantName,
        applicantEmail: applicant.applicantEmail,
        interviewTime: committee.interviewTime,
      });
    }
  }

  return Object.values(committeesToEmail);
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
  // for (const applicant of applicantsToEmail) {
  //   const typedApplicant: emailApplicantInterviewType = applicant;
  //   const applicantEmail = [typedApplicant.applicantEmail];
  //   const subject = `Hei, ${typedApplicant.period_name}. Her er dine intervjutider!`;
  //   let body = `Intervjutider:\n\n`;

  //   typedApplicant.committees.forEach((committee: any) => {
  //     body += `Komite: ${committee.committeeName}\n`;
  //     body += `Start: ${committee.interviewTimes.start}\n`;
  //     body += `Slutt: ${committee.interviewTimes.end}\n`;
  //     body += `Rom: ${committee.interviewTimes.room}\n\n`;
  //   });

  //   body += `Med vennlig hilsen,\nAppkom <3`;

  //   // await sendEmail({
  //   //   sesClient: sesClient,
  //   //   fromEmail: "opptak@online.ntnu.no",
  //   //   toEmails: applicantEmail,
  //   //   subject: subject,
  //   //   htmlContent: body,
  //   // });

  //   console.log(
  //     "fromEmail",
  //     "opptak@online.ntnu.no",
  //     "toEmails",
  //     applicantEmail,
  //     "subject",
  //     subject,
  //     "htmlContent",
  //     body
  //   );
  // }

  // Send email to each committee
  for (const committee of committeesToEmail) {
    const typedCommittee: emailCommitteeInterviewType = committee;
    const committeeEmail = [typedCommittee.committeeEmail];
    const subject = `${changeDisplayName(
      typedCommittee.committeeName
    )}s sine intervjutider for ${typedCommittee.period_name}`;
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

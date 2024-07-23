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
import { formatAndSendEmails } from "./formatAndSend";

interface Props {
  periodId: string;
}

export const sendOutInterviewTimes = async ({ periodId }: Props) => {
  const period: periodType = await fetchPeriod(periodId);
  const committeeInterviewTimes: committeeInterviewType[] =
    await fetchCommitteeInterviewTimes(periodId);
  const committeeEmails: committeeEmails[] = await fetchCommitteeEmails();

  const algorithmData: algorithmType = algorithmTestData;

  const applicantsToEmail: emailApplicantInterviewType[] = formatApplicants(
    algorithmData,
    periodId,
    period,
    committeeEmails,
    committeeInterviewTimes
  );

  const committeesToEmail: emailCommitteeInterviewType[] =
    formatCommittees(applicantsToEmail);

  // console.log(applicantsToEmailMap);
  // console.log(committeesToEmail);

  await formatAndSendEmails({ committeesToEmail, applicantsToEmail });
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
          time.committee.toLowerCase() === interview.committeeName.toLowerCase()
      );

      let room = "";

      if (committeeTime) {
        const availableTime = committeeTime.availabletimes.find(
          (available) =>
            available.start <= interview.start && available.end >= interview.end
        );
        if (availableTime) {
          room = availableTime.room;
        }
      }

      return {
        committeeName: interview.committeeName,
        committeeEmail: committeeEmail?.email || "",
        interviewTime: {
          start: interview.start,
          end: interview.end,
          room: room,
        },
      };
    });

    const applicantToEmail = {
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

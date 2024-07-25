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

import { changeDisplayName } from "../toString";
import { fetchCommitteeEmails } from "./fetchFunctions";
import { formatAndSendEmails } from "./formatAndSend";
import toast from "react-hot-toast";
import { getPeriodById } from "../../mongo/periods";
import { getCommitteesByPeriod } from "../../mongo/committees";
import { getInterviewsByPeriod } from "../../mongo/interviews";

interface Props {
  periodId: string;
}

export const sendOutInterviewTimes = async ({ periodId }: Props) => {
  try {
    const periodData = await getPeriodById(periodId);

    if (!periodData.exists || !periodData.period) {
      return { error: "Failed to find period" };
    }
    const period: periodType = periodData.period;

    const commmitteeInterviewTimesData = await getCommitteesByPeriod(periodId);

    if (!commmitteeInterviewTimesData || commmitteeInterviewTimesData.error) {
      return { error: "Failed to find committee interview times" };
    }

    const committeeInterviewTimes: committeeInterviewType[] =
      commmitteeInterviewTimesData.result || [];

    const committeeEmails: committeeEmails[] = await fetchCommitteeEmails();

    const fetchedAlgorithmData = await getInterviewsByPeriod(periodId);

    const algorithmData: algorithmType[] =
      fetchedAlgorithmData.interviews || [];

    const applicantsToEmail: emailApplicantInterviewType[] = formatApplicants(
      algorithmData,
      periodId,
      period,
      committeeEmails,
      committeeInterviewTimes
    );

    const committeesToEmail: emailCommitteeInterviewType[] =
      formatCommittees(applicantsToEmail);

    const dataToSend = {
      committeesToEmail,
      applicantsToEmail,
    };

    formatAndSendEmails(dataToSend);
  } catch (error) {
    return { error: "Failed to send out interview times" };
  }
};

const formatApplicants = (
  algorithmData: algorithmType[],
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

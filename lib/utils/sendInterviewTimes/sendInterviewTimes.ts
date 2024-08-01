import {
  committeeEmails,
  committeeInterviewType,
  emailApplicantInterviewType,
  emailCommitteeInterviewType,
  periodType,
  algorithmType,
} from "../../types/types";

import { fetchCommitteeEmails } from "./fetchFunctions";
import { formatAndSendEmails } from "./formatAndSend";
import { getPeriods, markInverviewsSentByPeriodId } from "../../mongo/periods";
import { getCommitteesByPeriod } from "../../mongo/committees";
import { getInterviewsByPeriod } from "../../mongo/interviews";

export const sendOutInterviewTimes = async () => {
  try {
    const { periods } = await getPeriods();

    if (!periods) {
      return { error: "Failed to find period" };
    }

    for (const period of periods) {
      if (
        period.hasSentInterviewTimes === false &&
        period.applicationPeriod.end < new Date()
      ) {
        const periodId = String(period._id);

        const committeeInterviewTimesData =
          await getCommitteesByPeriod(periodId);
        if (!committeeInterviewTimesData || committeeInterviewTimesData.error) {
          return { error: "Failed to find committee interview times" };
        }

        const committeeInterviewTimes =
          committeeInterviewTimesData.result || [];
        const committeeEmails = await fetchCommitteeEmails();

        const fetchedAlgorithmData = await getInterviewsByPeriod(periodId);
        const algorithmData = fetchedAlgorithmData.interviews || [];

        const applicantsToEmail = formatApplicants(
          algorithmData,
          periodId,
          period,
          committeeEmails,
          committeeInterviewTimes
        );

        const committeesToEmail = formatCommittees(applicantsToEmail);

        await formatAndSendEmails({ committeesToEmail, applicantsToEmail });
        markInverviewsSentByPeriodId(periodId);
      }
    }
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

      let room = "Info kommer";

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
      applicantPhone: app.applicantPhone,
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
        applicantPhone: applicant.applicantPhone,
        applicantEmail: applicant.applicantEmail,
        interviewTime: committee.interviewTime,
      });
    }
  }

  return Object.values(committeesToEmail);
};

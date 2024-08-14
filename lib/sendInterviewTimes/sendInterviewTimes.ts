import { getApplication, getApplicationByMongoId } from "../mongo/applicants";
import { getCommitteesByPeriod } from "../mongo/committees";
import { getInterviewsByPeriod } from "../mongo/interviews";
import { getPeriodById, markInterviewsSentByPeriodId } from "../mongo/periods";
import {
  committeeEmails,
  committeeInterviewType,
  emailApplicantInterviewType,
  emailCommitteeInterviewType,
  periodType,
  algorithmType,
  preferencesType,
  committeePreferenceType,
} from "../types/types";
import { fetchCommitteeEmails } from "./fetchFunctions";
import { formatAndSendEmails } from "./formatAndSend";

export const sendOutInterviewTimes = async ({
  periodId,
}: {
  periodId: string;
}) => {
  try {
    const { period } = await getPeriodById(periodId);
    if (!period) {
      console.log("Failed to find period");
      return { error: "Failed to find period" };
    }

    if (period.hasSentInterviewTimes) {
      console.log("Interview times already sent");
      return { error: "Interview times already sent" };
    }

    const committeeInterviewTimesData = await getCommitteesByPeriod(periodId);
    if (!committeeInterviewTimesData || committeeInterviewTimesData.error) {
      return { error: "Failed to find committee interview times" };
    }

    const committeeInterviewTimes = committeeInterviewTimesData.result || [];

    const committeeEmails = await fetchCommitteeEmails();

    const fetchedAlgorithmData = await getInterviewsByPeriod(periodId);
    const algorithmData = fetchedAlgorithmData.interviews || [];

    const applicantsToEmail = await formatApplicants(
      algorithmData,
      periodId,
      period,
      committeeEmails,
      committeeInterviewTimes
    );

    console.log(applicantsToEmail);

    const committeesToEmail = formatCommittees(applicantsToEmail);

    await formatAndSendEmails({ committeesToEmail, applicantsToEmail });
    markInterviewsSentByPeriodId(periodId);
  } catch (error) {
    return { error: "Failed to send out interview times" };
  }
};

const formatApplicants = async (
  algorithmData: algorithmType[],
  periodId: string,
  period: periodType,
  committeeEmails: committeeEmails[],
  committeeInterviewTimes: committeeInterviewType[]
): Promise<emailApplicantInterviewType[]> => {
  const applicantsToEmailMap: emailApplicantInterviewType[] = [];

  for (const app of algorithmData) {
    const dbApplication = await getApplicationByMongoId(
      app.applicantId,
      periodId
    );

    console.log(dbApplication);

    if (!dbApplication || !dbApplication.application) continue;

    const preferencesCommittees: string[] =
      "first" in dbApplication.application.preferences
        ? [
            dbApplication.application.preferences.first,
            dbApplication.application.preferences.second,
            dbApplication.application.preferences.third,
          ].filter((committee) => committee !== "")
        : dbApplication.application.preferences.map(
            (preference: committeePreferenceType) => preference.committee
          );

    const allCommittees = [
      ...preferencesCommittees,
      ...dbApplication.application.optionalCommittees,
    ];

    const scheduledCommittees = app.interviews.map(
      (interview) => interview.committeeName
    );

    const missingCommittees = allCommittees.filter(
      (committee) => !scheduledCommittees.includes(committee)
    );

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

    for (const missingCommittee of missingCommittees) {
      const committeeEmail = committeeEmails.find(
        (email) =>
          email.name_short.toLowerCase() === missingCommittee.toLowerCase()
      );

      committees.push({
        committeeName: missingCommittee,
        committeeEmail: committeeEmail?.email || "",
        interviewTime: {
          start: "Ikke satt",
          end: "Ikke satt",
          room: "Ikke satt",
        },
      });
    }

    const applicantToEmail = {
      periodId: periodId,
      period_name: period.name,
      applicantName: dbApplication.application.name,
      applicantEmail: dbApplication.application.email,
      applicantPhone: dbApplication.application.phone,
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
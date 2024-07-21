import {
  emailApplicantInterviewType,
  emailCommitteeInterviewType,
} from "../types/types";

export const applicantTestData: emailApplicantInterviewType[] = [
  {
    periodId: "1",
    period_name: "Fall 2023 Recruitment",
    applicantName: "Emily Johnson",
    applicantEmail: "emily.johnson@example.com",
    committees: [
      {
        name: "Arrkom",
        interviewTimes: {
          start: "2023-09-15T10:00:00Z",
          end: "2023-09-15T10:30:00Z",
        },
      },
      {
        name: "Appkom",
        interviewTimes: {
          start: "2023-09-16T14:00:00Z",
          end: "2023-09-16T14:30:00Z",
        },
      },
    ],
  },
  {
    periodId: "2",
    period_name: "Spring 2024 Recruitment",
    applicantName: "Michael Brown",
    applicantEmail: "michael.brown@example.com",
    committees: [
      {
        name: "Tech Committee",
        interviewTimes: {
          start: "2024-03-10T09:00:00Z",
          end: "2024-03-10T09:30:00Z",
        },
      },
      {
        name: "Cultural Committee",
        interviewTimes: {
          start: "2024-03-11T11:00:00Z",
          end: "2024-03-11T11:30:00Z",
        },
      },
    ],
  },
  {
    periodId: "3",
    period_name: "Summer 2024 Recruitment",
    applicantName: "Sarah Lee",
    applicantEmail: "sarah.lee@example.com",
    committees: [
      {
        name: "Finance Committee",
        interviewTimes: {
          start: "2024-06-20T13:00:00Z",
          end: "2024-06-20T13:30:00Z",
        },
      },
      {
        name: "Events Committee",
        interviewTimes: {
          start: "2024-06-21T15:00:00Z",
          end: "2024-06-21T15:30:00Z",
        },
      },
    ],
  },
];

export const committeeTestData: emailCommitteeInterviewType[] = [
  {
    periodId: "1",
    period_name: "Fall 2023 Recruitment",
    committeeName: "Admissions Committee",
    committeeEmail: "admissions@university.edu",
    applicants: [
      {
        name: "John Doe",
        interviewTimes: {
          start: "2023-09-15T10:00:00Z",
          end: "2023-09-15T10:30:00Z",
        },
      },
      {
        name: "Jane Smith",
        interviewTimes: {
          start: "2023-09-15T11:00:00Z",
          end: "2023-09-15T11:30:00Z",
        },
      },
    ],
  },
  {
    periodId: "2",
    period_name: "Spring 2024 Recruitment",
    committeeName: "Tech Committee",
    committeeEmail: "tech@university.edu",
    applicants: [
      {
        name: "Michael Brown",
        interviewTimes: {
          start: "2024-03-10T09:00:00Z",
          end: "2024-03-10T09:30:00Z",
        },
      },
      {
        name: "Anna Davis",
        interviewTimes: {
          start: "2024-03-10T10:00:00Z",
          end: "2024-03-10T10:30:00Z",
        },
      },
    ],
  },
  {
    periodId: "3",
    period_name: "Summer 2024 Recruitment",
    committeeName: "Events Committee",
    committeeEmail: "events@university.edu",
    applicants: [
      {
        name: "Sarah Lee",
        interviewTimes: {
          start: "2024-06-21T15:00:00Z",
          end: "2024-06-21T15:30:00Z",
        },
      },
      {
        name: "John Williams",
        interviewTimes: {
          start: "2024-06-21T16:00:00Z",
          end: "2024-06-21T16:30:00Z",
        },
      },
    ],
  },
];

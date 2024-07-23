import { ObjectId } from "mongodb";

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type commiteeType = {
  periodId: string;
  period_name: string;
  committee: string;
  availableTimes: [
    {
      start: string;
      end: string;
    },
  ];
  timeslot: string;
  message: string;
};

export type preferencesType = {
  first: string;
  second: string;
  third: string;
};

export type committeePreferenceType = {
  committee: string;
};

export type applicantType = {
  owId: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  about: string;
  preferences: preferencesType | committeePreferenceType[];
  bankom: "yes" | "no" | "maybe";
  optionalCommittees: string[];
  selectedTimes: [
    {
      start: string;
      end: string;
    },
  ];
  date: Date;
  periodId: string | ObjectId;
};

// applicantType modified to fit email content
export type emailDataType = {
  name: string;
  emails: string[];
  phone: string;
  grade: string;
  about: string;
  firstChoice: string;
  secondChoice: string;
  thirdChoice: string;
  bankom: "Ja" | "Nei" | "Kanskje";
  optionalCommittees: string;
};

export type periodType = {
  _id: ObjectId;
  name: string;
  description: string;
  applicationPeriod: {
    start: Date;
    end: Date;
  };
  interviewPeriod: {
    start: Date;
    end: Date;
  };
  committees: string[];
  optionalCommittees: string[];
  hasSentInterviewTimes: boolean;
};

export type AvailableTime = {
  start: string;
  end: string;
};

export type committeeInterviewType = {
  periodId: string;
  period_name: string;
  committee: string;
  availabletimes: AvailableTime[];
  timeslot: string;
  message: string;
};

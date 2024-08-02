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
  bankom: bankomOptionsType;
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

export type bankomOptionsType = "yes" | "no" | "maybe" | undefined;

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
  room: string;
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

export type owCommitteeType = {
  name_short: string;
  name_long: string;
  email?: string;
  description_long?: string;
  description_short?: string;
  application_description?: string;
  image?: { xs: string };
};

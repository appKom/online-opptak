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
};

export type applicantType = {
  owId: string;
  name: string;
  email: string;
  phone: string;
  grade: number;
  about: string;
  preferences: {
    first: string;
    second: string;
    third: string;
  };
  bankom: "yes" | "no" | "maybe";
  feminIt: "yes" | "no";
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
  grade: number;
  about: string;
  firstChoice: string;
  secondChoice: string;
  thirdChoice: string;
  bankom: "Ja" | "Nei" | "Kanskje";
  feminIt: "Ja" | "Nei";
};

export type periodType = {
  _id: ObjectId;
  name: string;
  description: string;
  preparationPeriod: {
    start: Date;
    end: Date;
  };
  applicationPeriod: {
    start: Date;
    end: Date;
  };
  interviewPeriod: {
    start: Date;
    end: Date;
  };
  committees: string[];
};

export type AvailableTime = {
  start: string;
  end: string;
};

export type applicantTypeForCommittees = {
  _id: ObjectId;
  owId: string;
  name: string;
  email: string;
  phone: string;
  grade: number;
  about: string;
  preferences: { committee: string }[];
  bankom: "yes" | "no" | "maybe";
  feminIt: "yes" | "no";
  selectedTimes: [
    {
      start: string;
      end: string;
    },
  ];
  date: Date;
  periodId: string | ObjectId;
};

export type committeeInterviewType = {
  periodId: string;
  period_name: string;
  committee: string;
  availabletimes: AvailableTime[];
  timeslot: string;
};

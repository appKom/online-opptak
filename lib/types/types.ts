export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type commiteeType = {
  name: string;
  email: string;
  availableTimes: [
    {
      start: string;
      end: string;
    },
  ];
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
  bankom: "yes" | "no" | "maybe" | undefined;
  feminIt: "yes" | "no" | undefined;
  selectedTimes?: [
    {
      start: string;
      end: string;
    },
  ];
  date?: Date;
};

export type periodType = {
  _id: string;
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

export type UserProfile = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  year: number;
  email: string;
  online_mail: string;
  phone_number: string;
  is_committee: boolean;
  is_member: boolean;
  image: string;
};

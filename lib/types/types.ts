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
  owId: number;
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
  bankom: boolean;
  feminIt: boolean;
  selectedTimes?: [
    {
      start: string;
      end: string;
    },
  ];
  applicationDate: Date;
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

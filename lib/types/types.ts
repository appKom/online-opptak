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
  owId: number | undefined;
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
  applicationDate: Date | undefined;
};

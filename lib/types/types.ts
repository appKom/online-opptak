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

import { ObjectId } from "mongodb";

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};



export type periodType = {
  _id: ObjectId;
  name: string;
  description: string;
  timePeriod: {
    start: Date;
    end: Date;
  };
  displayHours: boolean;
  hasPassword: boolean;
  eventPassword: string;
};
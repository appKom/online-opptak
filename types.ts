export interface IUser {
  name: string;
  email: string;
}

export interface DBapplicant {
  id: String;
  feminit: Boolean;
  about: String;
  bankkom: Boolean;
  committeechoice1: String;
  committeechoice2: String;
  committeechoice3: String;
  email: String;
  informatikkyear: Number;
  name: String;
  phone: String;
}

export interface ValidDates {
  year: string;
  dates: string[][];
}

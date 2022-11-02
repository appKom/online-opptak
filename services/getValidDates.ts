import axios from "axios";
import { ValidDates } from "../types";
export function getValidDates(): Promise<{ dates: ValidDates }> {
  return axios("/api/getValidDates").then((result) => result.data);
}

export default getValidDates;

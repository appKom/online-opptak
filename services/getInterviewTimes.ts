import { Interview } from "@prisma/client";
import axios from "axios";
export function getInterviewTimes(): Promise<{ interviews: Interview[] }> {
  return axios(`/api/getInterviewTimes`).then((result) => result.data);
}

export default getInterviewTimes;

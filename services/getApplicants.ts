import { Applicant } from "@prisma/client";
import axios from "axios";
import { DBapplicant } from "../types";
export function getApplicants(): Promise<{ applicants: Applicant[] }> {
  return axios("/api/getapplicants").then((result) => result.data);
}

export default getApplicants;

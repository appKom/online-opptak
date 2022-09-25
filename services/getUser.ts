import axios from "axios";
import { IUser } from "../types";
export function getUser(): Promise<IUser> {
  return axios("/api/user").then((result) => result.data);
}

export default getUser;

import { IUser } from "../types";
import axiosClient from "./apiClient";
const getUser: () => Promise<IUser | Error> = () => {
  return axiosClient.get("/user").then((res) => res.data);
};

export default getUser;

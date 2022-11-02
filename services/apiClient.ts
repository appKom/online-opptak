import axios from "axios";
import { BASE_URL } from "../utils/getBaseUrl";

const axiosClient = axios.create({
  baseURL: BASE_URL + "/api",
});

export default axiosClient;

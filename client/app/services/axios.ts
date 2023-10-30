import axios, { Method } from "axios";
import { AuthDetails } from "../components/AuthContext"; // Assuming AuthDetails is the type for your authDetails object
import { useRouter } from "next/router";

interface ApiRequestOptions<T> {
  method: Method;
  url: string;
  data: T;
  headers: Record<string, string>;
}

const AxiosApi = async <T>(
  method: Method = "post",
  url: string,
  data: T,
  authDetails: AuthDetails
) => {
  const { token, userId } = authDetails;

  if (!token || !userId) {
    throw new Error("Authentication details not available.");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    mode: "cors",
  };

  const options: ApiRequestOptions<T> = {
    method,
    url,
    data: data,
    headers,
  };

  return axios(options);
};

export default AxiosApi;

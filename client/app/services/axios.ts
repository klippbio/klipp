import axios, { Method } from "axios";
import { AuthDetails } from "../components/AuthContext"; // Assuming AuthDetails is the type for your authDetails object

interface ApiRequestOptions<T> {
  method: Method;
  url: string;
  data: T;
  headers: Record<string, string> | undefined;
}

const AxiosApi = async <T>(
  method: Method,
  url: string,
  data: T = {} as T,
  authDetails: AuthDetails = {
    token: undefined,
    userId: undefined,
    storeId: undefined,
    storeUrl: undefined,
  }
) => {
  const { token } = authDetails;
  let headers;

  // if (token) {
  //   headers = {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //     mode: "cors",
  //   };
  // }

  const options: ApiRequestOptions<T> = {
    method,
    url,
    data: data,
    headers: headers,
  };

  return axios(options);
};

export default AxiosApi;

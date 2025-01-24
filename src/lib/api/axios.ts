import axios from "axios";
import { getAccessToken } from "../auth/sessionTokenAccessor";

const createHelperAxios = (isClient: boolean) => {
 return axios.create({
    baseURL: isClient
      ? process.env.NEXT_PUBLIC_FHIR_HELPER_SERVICE
      : process.env.FHIR_HELPER_SERVICE,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

export const fhirServer = axios.create({
  baseURL: process.env.FHIR_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const fhirHelperServer = createHelperAxios(false);
export const fhirHelperServerClient = createHelperAxios(true);

fhirServer.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();

    config.headers.Authorization = `Bearer ${token}`.trim();
    return config;
  },
  (error) => Promise.reject(error)
);

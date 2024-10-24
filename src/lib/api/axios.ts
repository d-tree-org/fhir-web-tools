import axios from "axios";
import { getAccessToken } from "../auth/sessionTokenAccessor";

export const fhirServer = axios.create({
  baseURL: process.env.FHIR_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const fhirHelperServer = axios.create({
  baseURL: process.env.FHIR_HELPER_SERVICE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

fhirServer.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();

    config.headers.Authorization = `Bearer ${token}`.trim();
    return config;
  },
  (error) => Promise.reject(error)
);

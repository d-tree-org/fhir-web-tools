import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.FHIR_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    console.log(config);
    return config;
  },
  (error) => Promise.reject(error)
);

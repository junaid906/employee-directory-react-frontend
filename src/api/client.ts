import axios from "axios";
import { auth } from "../auth/userManager";

const baseURL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(
  /\/$/,
  "",
);

if (!baseURL) {
  console.warn(
    "VITE_API_URL is not set. Falling back to http://localhost:5102",
  );
}

export const apiClient = axios.create({
  baseURL: baseURL ?? "http://localhost:5102",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (config) => {
  const user = await auth.getUser();
  if (user && !user.expired) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      await auth.signinRedirect({
        state: { returnTo: window.location.pathname + window.location.search },
      });
    }
    return Promise.reject(error);
  },
);

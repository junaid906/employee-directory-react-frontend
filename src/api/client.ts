import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(
  /\/$/,
  "",
);

if (!baseURL) {
  console.warn("VITE_API_URL is not set. Falling back to http://localhost:5102");
}

export const apiClient = axios.create({
  baseURL: baseURL ?? "http://localhost:5102",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

import axios from "axios";
import { API_UNREACHABLE_ERROR, PERMISSION_DENIED_ERROR } from "./messages";

export function getProblemDetailsMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return API_UNREACHABLE_ERROR;
    if (error.response.status === 403) return PERMISSION_DENIED_ERROR;

    const data = error.response.data as
      | { title?: unknown; detail?: unknown }
      | undefined;

    const title = typeof data?.title === "string" ? data.title.trim() : "";
    if (title) return title;

    const detail = typeof data?.detail === "string" ? data.detail.trim() : "";
    if (detail) return detail;
  }

  return fallback;
}

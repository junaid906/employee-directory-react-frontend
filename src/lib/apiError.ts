import axios from "axios";

export function getProblemDetailsMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { title?: unknown; detail?: unknown }
      | undefined;

    const title = typeof data?.title === "string" ? data.title.trim() : "";
    if (title) return title;

    const detail = typeof data?.detail === "string" ? data.detail.trim() : "";
    if (detail) return detail;
  }

  return fallback;
}

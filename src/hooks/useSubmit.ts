import { useState } from "react";
import { getProblemDetailsMessage } from "../lib/apiError";

export function useSubmit<TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<void>,
  errorMessage: string,
) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(...args: TArgs) {
    setSubmitting(true);
    setError(null);
    try {
      await action(...args);
    } catch (caught) {
      setError(getProblemDetailsMessage(caught, errorMessage));
    } finally {
      setSubmitting(false);
    }
  }

  function clearError() {
    setError(null);
  }

  return { submit, submitting, error, clearError };
}

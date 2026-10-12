import { useEffect, useRef, useState } from "react";
import { getProblemDetailsMessage } from "../lib/apiError";

type AsyncResult<T> =
  | { requestKey: string; status: "success"; data: T }
  | { requestKey: string; status: "error"; error: unknown };

export function useAsyncData<T>(
  key: string,
  fetcher: () => Promise<T>,
  errorMessage: string,
) {
  const fetcherRef = useRef(fetcher);
  const [reloadToken, setReloadToken] = useState(0);
  const [result, setResult] = useState<AsyncResult<T> | null>(null);

  const requestKey = `${key}:${reloadToken}`;

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    let cancelled = false;

    fetcherRef.current()
      .then((data) => {
        if (!cancelled) {
          setResult({ requestKey, status: "success", data });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setResult({ requestKey, status: "error", error });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey, errorMessage]);

  function reload() {
    setReloadToken((token) => token + 1);
  }

  const current =
    result?.requestKey === requestKey ? result : null;

  return {
    data: current?.status === "success" ? current.data : null,
    loading: current === null,
    error:
      current?.status === "error"
        ? getProblemDetailsMessage(current.error, errorMessage)
        : null,
    reload,
  };
}

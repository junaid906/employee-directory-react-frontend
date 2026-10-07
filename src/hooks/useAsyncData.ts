import { useEffect, useRef, useState } from "react";

interface AsyncResult<T> {
  requestKey: string;
  data: T | null;
  error: string | null;
}

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
          setResult({ requestKey, data, error: null });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResult({ requestKey, data: null, error: errorMessage });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey, errorMessage]);

  function reload() {
    setReloadToken((token) => token + 1);
  }

  const isCurrent = result !== null && result.requestKey === requestKey;

  return {
    data: isCurrent ? result.data : null,
    loading: !isCurrent,
    error: isCurrent ? result.error : null,
    reload,
  };
}

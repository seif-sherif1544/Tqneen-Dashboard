import { useState, useEffect, useCallback } from "react";

export function useAsync(
  asyncFunction,
  { immediate = false }
) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");



  const execute = useCallback(
    (params) => {
      setLoading(true)
      setStatus("pending")

      return asyncFunction(params)
        .then((response) => {
          setData(response.data)
          setLoading(false)
          setStatus("success")

        })
        .catch((error) => {
          setLoading(false)
          setError(error)
        });
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (immediate)
      execute();
  }, [immediate]);

  return { execute, data, loading, status, error };
}

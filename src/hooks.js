import { useEffect, useState, useMemo } from "react";
import axiosRetry from "axios-retry";
import axiosInstance from 'utils/axiosInstance'; // Adjust path if needed

// Optional: configure retry on your instance or remove if already configured there
axiosRetry(axiosInstance, { retries: 0 });

export const useAxios = (url, method = "get", options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const memoizedConfig = useMemo(
    () => ({ method, url, ...options }),
    [method, url, options]
  );

  useEffect(() => {
    let isMounted = true;
    const source = axiosInstance.CancelToken.source();

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance({
          ...memoizedConfig,
          cancelToken: source.token,
        });
        if (isMounted) {
          setData(response.data);
          setError(null);
        }
      } catch (err) {
        if (axiosInstance.isCancel(err)) {
          console.log("Request cancelled:", url);
        } else {
          if (isMounted) {
            console.error("Fetch error:", {
              message: err.message,
              status: err.response?.status,
              url,
              data: err.response?.data,
              headers: err.config?.headers,
            });
            setError(err.response?.data?.error || "Request failed");
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      source.cancel(`Cancelled request to ${url}`);
    };
  }, [memoizedConfig, url]);

  return { data, loading, error };
};

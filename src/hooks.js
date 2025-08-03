import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";

// Disable retries
axiosRetry(axios, { retries: 0 });

export const useAxios = (url, method = "get", options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => JSON.stringify(options), [options]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios({ method, url, ...options });
        if (isMounted) {
          setData(response.data);
          setError(null);
        }
      } catch (err) {
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
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, method, memoizedOptions]);

  return { data, loading, error };
};
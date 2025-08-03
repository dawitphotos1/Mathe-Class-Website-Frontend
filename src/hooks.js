// import { useEffect, useState } from "react";
// import axios from "axios";

// export const useAxios = (url, method = "get", options = {}) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios({ method, url, ...options });
//         if (isMounted) {
//           setData(response.data);
//           setError(null);
//         }
//       } catch (err) {
//         if (isMounted) {
//           console.error("Fetch error:", {
//             message: err.message,
//             status: err.response?.status,
//             url,
//             data: err.response?.data,
//           });
//           setError(err.response?.data?.error || "Request failed");
//         }
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchData();

//     return () => {
//       isMounted = false;
//     };
//   }, [url, method, JSON.stringify(options)]);

//   return { data, loading, error };
// };



import { useEffect, useState } from "react";
import axios from "axios";

export const useAxios = (url, method = "get", options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  }, [url, method, JSON.stringify(options)]);

  return { data, loading, error };
};
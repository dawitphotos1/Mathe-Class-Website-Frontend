

// export const API_BASE_URL =
//   process.env.REACT_APP_API_URL ||
//   "https://mathe-class-website-backend-1.onrender.com/api/v1";

// export const STRIPE_PUBLIC_KEY =
//   process.env.REACT_APP_STRIPE_PUBLIC_KEY ||
//   "pk_test_51RGp1MPDOYB6WrY6eEc1GEtGRURKU9mcQ7zfNSefzRUJr9CTNEhrUamWbMK8e70ufxqLIof2PmBu1syoI8xwlgFi00T9XUdTSm";





// config.js

// Ensure API URL always ends with /api/v1
const rawApiUrl =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://mathe-class-website-backend-1.onrender.com"
    : "http://localhost:5000");

// ✅ Guarantee /api/v1 suffix
export const API_BASE_URL = rawApiUrl.endsWith("/api/v1")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, "")}/api/v1`;

export const STRIPE_PUBLIC_KEY =
  process.env.REACT_APP_STRIPE_PUBLIC_KEY ||
  "pk_test_51RGp1MPDOYB6WrY6eEc1GEtGRURKU9mcQ7zfNSefzRUJr9CTNEhrUamWbMK8e70ufxqLIof2PmBu1syoI8xwlgFi00T9XUdTSm";

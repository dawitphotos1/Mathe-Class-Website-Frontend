// config.js

// 🌍 API base URL
export const API_BASE_URL =
  process.env.REACT_APP_API_URL?.replace(/\/+$/, "") || // remove trailing slashes if any
  "F";

// 💳 Stripe Public Key
export const STRIPE_PUBLIC_KEY =
  process.env.REACT_APP_STRIPE_PUBLIC_KEY ||
  "pk_test_51RGp1MPDOYB6WrY6eEc1GEtGRURKU9mcQ7zfNSefzRUJr9CTNEhrUamWbMK8e70ufxqLIof2PmBu1syoI8xwlgFi00T9XUdTSm";

// 🛠️ Debug logging (optional toggle)
export const IS_DEV = !process.env.NODE_ENV || process.env.NODE_ENV === "development";



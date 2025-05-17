// config.js
import axios from "axios"; // ✅ Ensure imports are at the top

// ✅ Fallback to local URL if environment variable is not set
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

// ✅ Fallback to test public Stripe key if env variable is not set
export const STRIPE_PUBLIC_KEY =
  process.env.REACT_APP_STRIPE_PUBLIC_KEY ||
  "pk_test_51RGp1MPDOYB6WrY6eEc1GEtGRURKU9mcQ7zfNSefzRUJr9CTNEhrUamWbMK8e70ufxqLIof2PmBu1syoI8xwlgFi00T9XUdTSm";

// ✅ Ensures axios sends cookies (e.g., JWT auth) with requests
axios.defaults.withCredentials = true;

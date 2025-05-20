// // src/config/config.js
// import axios from "axios";

// // ✅ Backend API base URL (Render deployment or local fallback)
// export const API_BASE_URL =
//   process.env.REACT_APP_API_URL || "http://localhost:5000";

// // ✅ Stripe public key (fallback if .env not set)
// export const STRIPE_PUBLIC_KEY =
//   process.env.REACT_APP_STRIPE_PUBLIC_KEY ||
//   "pk_test_51RGp1MPDOYB6WrY6eEc1GEtGRURKU9mcQ7zfNSefzRUJr9CTNEhrUamWbMK8e70ufxqLIof2PmBu1syoI8xwlgFi00T9XUdTSm";

// // ✅ Ensure credentials (e.g., JWT cookies) are included with requests
// axios.defaults.withCredentials = true;




// src/config/config.js
import axios from "axios";

// ✅ Explicit API base URL to avoid incorrect fallbacks
export const API_BASE_URL = "https://mathe-class-website-backend-8.onrender.com";

// ✅ Stripe public key (fallback if .env not set)
export const STRIPE_PUBLIC_KEY =
  process.env.REACT_APP_STRIPE_PUBLIC_KEY ||
  "pk_test_51RGp1MPDOYB6WrY6eEc1GEtGRURKU9mcQ7zfNSefzRUJr9CTNEhrUamWbMK8e70ufxqLIof2PmBu1syoI8xwlgFi00T9XUdTSm";

// ✅ Use credentials (JWT cookies if needed)
axios.defaults.withCredentials = true;

// ✅ Optional: Set global baseURL for axios if you use axios without full URLs
axios.defaults.baseURL = API_BASE_URL + "/api/v1";


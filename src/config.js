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




// // src/config/config.js
// import axios from "axios";

// // ✅ Set full base URL without adding /api/v1 here
// export const API_BASE_URL = "https://mathe-class-website-backend-8.onrender.com";

// // ✅ Stripe public key
// export const STRIPE_PUBLIC_KEY =
//   process.env.REACT_APP_STRIPE_PUBLIC_KEY ||
//   "pk_test_51RGp1MPDOYB6WrY6eEc1GEtGRURKU9mcQ7zfNSefzRUJr9CTNEhrUamWbMK8e70ufxqLIof2PmBu1syoI8xwlgFi00T9XUdTSm";

// // ✅ Keep credentials for cookies if needed
// axios.defaults.withCredentials = true;

// // ✅ 🚫 DO NOT set axios.defaults.baseURL manually if you're using full paths in your components.


export const API_BASE_URL =
  "https://mathe-class-website-backend-8.onrender.com";
export const STRIPE_PUBLIC_KEY =
  process.env.REACT_APP_STRIPE_PUBLIC_KEY ||
  "pk_test_51RGp1MPDOYB6WrY6eEc1GEtGRURKU9mcQ7zfNSefzRUJr9CTNEhrUamWbMK8e70ufxqLIof2PmBu1syoI8xwlgFi00T9XUdTSm";
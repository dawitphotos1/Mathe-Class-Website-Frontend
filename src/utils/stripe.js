// import { loadStripe } from "@stripe/stripe-js";

// // Safe Stripe initialization with fallback
// const getStripe = () => {
//   const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

//   if (!publishableKey) {
//     console.error("❌ Stripe publishable key is missing!");
//     console.log("🔧 Current environment variables:", {
//       REACT_APP_STRIPE_PUBLISHABLE_KEY:
//         process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
//       NODE_ENV: process.env.NODE_ENV,
//       API_URL: process.env.REACT_APP_API_URL,
//     });

//     // Return a rejected promise to prevent the match error
//     return Promise.reject(new Error("Stripe key missing"));
//   }

//   console.log("✅ Stripe key found, initializing...");
//   return loadStripe(publishableKey);
// };

// export default getStripe;





import { loadStripe } from "@stripe/stripe-js";

// Safe Stripe initialization with fallback
const getStripe = () => {
  const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.error("❌ Stripe publishable key is missing!");
    console.log("🔧 Current environment variables:", {
      REACT_APP_STRIPE_PUBLISHABLE_KEY:
        process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
      NODE_ENV: process.env.NODE_ENV,
      API_URL: process.env.REACT_APP_API_URL,
    });

    // Return a rejected promise to prevent the match error
    return Promise.reject(new Error("Stripe key missing"));
  }

  console.log("✅ Stripe key found, initializing...");
  return loadStripe(publishableKey);
};

export default getStripe;
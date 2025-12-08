// // import { useEffect, useState } from "react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useSearchParams } from "react-router-dom";

// export default function ConfirmAccount() {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token");
//   const [status, setStatus] = useState("loading");

//   useEffect(() => {
//     async function confirm() {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_URL}/auth/confirm-account?token=${token}`
//         );
//         if (res.data.success) setStatus("success");
//         else setStatus("error");
//       } catch {
//         setStatus("error");
//       }
//     }
//     if (token) confirm();
//   }, [token]);

//   if (status === "loading")
//     return (
//       <p className="text-center mt-10 text-lg">Confirming your account...</p>
//     );

//   if (status === "success")
//     return (
//       <div className="text-center mt-10">
//         <h2 className="text-2xl font-semibold text-green-600">
//           🎉 Your account has been confirmed!
//         </h2>
//         <p className="mt-2">You can now log in and start learning.</p>
//         <a
//           href="/login"
//           className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
//         >
//           Go to Login
//         </a>
//       </div>
//     );

//   return (
//     <div className="text-center mt-10">
//       <h2 className="text-2xl font-semibold text-red-600">
//         ❌ Invalid or expired confirmation link.
//       </h2>
//       <p className="mt-2">Please contact support or request a new link.</p>
//     </div>
//   );
// }





// src/pages/ConfirmAccount.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function ConfirmAccount() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function confirm() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'}/auth/confirm-account?token=${token}`
        );
        if (res.data.success) setStatus("success");
        else setStatus("error");
      } catch {
        setStatus("error");
      }
    }
    if (token) confirm();
  }, [token]);

  if (status === "loading")
    return (
      <p className="text-center mt-10 text-lg">Confirming your account...</p>
    );

  if (status === "success")
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-semibold text-green-600">
          🎉 Your account has been confirmed!
        </h2>
        <p className="mt-2">You can now log in and start learning.</p>
        <a
          href="/login"
          className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Go to Login
        </a>
      </div>
    );

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-semibold text-red-600">
        ❌ Invalid or expired confirmation link.
      </h2>
      <p className="mt-2">Please contact support or request a new link.</p>
    </div>
  );
}
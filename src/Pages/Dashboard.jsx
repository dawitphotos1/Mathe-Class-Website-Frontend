// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { API_BASE_URL } from "../config";
// import "./Dashboard.css";

// const Dashboard = ({ onLogout }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   console.log(
//     "Dashboard: onLogout prop:",
//     typeof onLogout === "function" ? "Function" : onLogout
//   );

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("token");
//       console.log("Dashboard: Checking token:", {
//         hasToken: !!token,
//         tokenPrefix: token ? token.substring(0, 20) + "..." : null,
//         isValid: token && token.startsWith("eyJ"),
//       });

//       if (!token || !token.startsWith("eyJ")) {
//         console.log(
//           "Dashboard: Invalid or missing token, redirecting to login"
//         );
//         toast.error("Please log in to access the dashboard");
//         navigate("/login");
//         return;
//       }

//       setTimeout(async () => {
//         try {
//           const instance = axios.create({
//             baseURL: API_BASE_URL,
//             headers: { Authorization: `Bearer ${token}` },
//             withCredentials: true,
//           });

//           console.log("Dashboard: Sending request to /users/me with headers:", {
//             Authorization: `Bearer ${token.substring(0, 20)}...`,
//           });

//           const res = await instance.get("/api/v1/users/me");
//           console.log("Dashboard: Fetch user response:", {
//             status: res.status,
//             data: res.data,
//             headers: res.headers,
//           });

//           setUser(res.data);
//           setLoading(false);
//         } catch (err) {
//           console.error("Dashboard: Fetch user error:", {
//             message: err.message,
//             code: err.code,
//             response: err.response?.data,
//             status: err.response?.status,
//             responseHeaders: err.response?.headers,
//           });
//           setLoading(false);
//           toast.error("Failed to load user data");
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//           navigate("/login");
//         }
//       }, 2000);
//     };

//     fetchUser();
//   }, [navigate]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     return <div>No user data available</div>;
//   }

//   return (
//     <div className="dashboard-container">
//       <h2>Welcome, {user.name}</h2>
//       <p>Email: {user.email}</p>
//       <p>Role: {user.role}</p>
//       {user.role === "student" && <p>Subject: {user.subject}</p>}
//       {onLogout && (
//         <button onClick={onLogout} className="logout-button">
//           Logout
//         </button>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";
import "./Dashboard.css";

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log(
    "Dashboard: onLogout prop:",
    typeof onLogout === "function" ? "Function" : onLogout
  );

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      console.log("Dashboard: Checking token:", {
        hasToken: !!token,
        tokenPrefix: token ? token.substring(0, 20) + "..." : null,
        isValid: token && token.startsWith("eyJ"),
      });

      if (!token || !token.startsWith("eyJ")) {
        console.log(
          "Dashboard: Invalid or missing token, redirecting to login"
        );
        toast.error("Please log in to access the dashboard");
        navigate("/login");
        return;
      }

      try {
        const instance = axios.create({
          baseURL: API_BASE_URL,
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        console.log("Dashboard: Sending request to /users/me with headers:", {
          Authorization: `Bearer ${token.substring(0, 20)}...`,
        });

        const res = await instance.get("/api/v1/users/me");
        console.log("Dashboard: Fetch user response:", {
          status: res.status,
          data: res.data,
          headers: res.headers,
        });

        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        setLoading(false);
      } catch (err) {
        console.error("Dashboard: Fetch user error:", {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          status: err.response?.status,
          responseHeaders: err.response?.headers,
        });
        setLoading(false);
        toast.error(err.response?.data?.error || "Failed to load user data");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {user.role === "student" && <p>Subject: {user.subject}</p>}
      {onLogout && (
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      )}
    </div>
  );
};

export default Dashboard;

// import React, { useState, useEffect, useCallback, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { API_BASE_URL } from "../config";
// import { AuthContext } from "../context/AuthContext";
// import "./AdminDashboard.css";

// const AdminDashboard = ({ onLogout }) => {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [pendingEnrollments, setPendingEnrollments] = useState([]);
//   const [approvedEnrollments, setApprovedEnrollments] = useState([]);
//   const [studentFilter, setStudentFilter] = useState("");
//   const [courseFilter, setCourseFilter] = useState("");
//   const [sortNewestFirst, setSortNewestFirst] = useState(true);

//   const [activeTab, setActiveTab] = useState("pendingUsers");
//   const [successActions, setSuccessActions] = useState({});

//   const handleError = useCallback(
//     (err, setError) => {
//       const status = err.response?.status;
//       if (status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         onLogout();
//         toast.error("Session expired. Please log in again.");
//         navigate("/login");
//       } else {
//         toast.error("Something went wrong");
//         setError("Something went wrong");
//       }
//     },
//     [navigate, onLogout]
//   );

//   const fetchPendingUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${API_BASE_URL}/api/v1/users/pending`, {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });
//       setPendingUsers(res.data);
//     } catch (err) {
//       handleError(err, () => {});
//     }
//   };

//   const fetchPendingEnrollments = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(
//         `${API_BASE_URL}/api/v1/enrollments/pending`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       setPendingEnrollments(res.data);
//     } catch (err) {
//       handleError(err, () => {});
//     }
//   };

//   const fetchApprovedEnrollments = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(
//         `${API_BASE_URL}/api/v1/enrollments/approved`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       setApprovedEnrollments(res.data);
//     } catch (err) {
//       handleError(err, () => {});
//     }
//   };

//   const handleApproveEnrollment = async (userId, courseId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `${API_BASE_URL}/api/v1/enrollments/approve`,
//         { userId, courseId },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       toast.success("Enrollment approved");
//       fetchPendingEnrollments();
//       fetchApprovedEnrollments();
//     } catch (err) {
//       handleError(err, () => {});
//     }
//   };

//   const exportToCSV = () => {
//     const rows = [...pendingEnrollments, ...approvedEnrollments];
//     const headers = ["Student", "Email", "Course", "AccessGrantedAt", "Status"];

//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       [
//         headers.join(","),
//         ...rows.map((e) =>
//           [
//             e.user?.name,
//             e.user?.email,
//             e.course?.title,
//             new Date(e.accessGrantedAt).toLocaleString(),
//             approvedEnrollments.includes(e) ? "Approved" : "Pending",
//           ].join(",")
//         ),
//       ].join("\n");

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "enrollments.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   useEffect(() => {
//     if (!user) return;
//     if (user.role === "admin") fetchPendingUsers();
//     if (["admin", "teacher"].includes(user.role)) {
//       fetchPendingEnrollments();
//       fetchApprovedEnrollments();
//     }
//   }, [user]);

//   useEffect(() => {
//     if (user?.role === "admin" && activeTab === "pendingUsers") {
//       fetchPendingUsers();
//     }
//   }, [activeTab, user]);

//   useEffect(() => {
//     if (["admin", "teacher"].includes(user?.role)) {
//       if (activeTab === "pendingEnrollments") fetchPendingEnrollments();
//       if (activeTab === "approvedEnrollments") fetchApprovedEnrollments();
//     }
//   }, [activeTab, user]);
  
  

//   if (!user || (user.role !== "admin" && user.role !== "teacher")) {
//     return <div className="unauthorized">Unauthorized</div>;
//   }

//   const allCourses = Array.from(
//     new Set(
//       [...pendingEnrollments, ...approvedEnrollments]
//         .map((e) => e.course?.title)
//         .filter(Boolean)
//     )
//   ).sort();

//   const filtered = (arr) =>
//     arr
//       .filter(
//         (e) =>
//           e.user?.name.toLowerCase().includes(studentFilter.toLowerCase()) &&
//           (courseFilter ? e.course?.title === courseFilter : true)
//       )
//       .sort((a, b) =>
//         sortNewestFirst
//           ? new Date(b.accessGrantedAt) - new Date(a.accessGrantedAt)
//           : new Date(a.accessGrantedAt) - new Date(b.accessGrantedAt)
//       );

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-card">
//         <h2>
//           {user.role === "admin" ? "Admin Dashboard" : "Teacher Dashboard"}
//         </h2>
//         <button onClick={onLogout} className="btn-secondary logout-btn">
//           Logout
//         </button>

//         {/* Tab Navigation */}
//         <div className="admin-tabs">
//           {user.role === "admin" && (
//             <button
//               className={activeTab === "pendingUsers" ? "tab-active" : ""}
//               onClick={() => setActiveTab("pendingUsers")}
//             >
//               👤 Pending Users
//             </button>
//           )}
//           <button
//             className={activeTab === "pendingEnrollments" ? "tab-active" : ""}
//             onClick={() => setActiveTab("pendingEnrollments")}
//           >
//             👤 Pending Enrollments
//           </button>
//           <button
//             className={activeTab === "approvedEnrollments" ? "tab-active" : ""}
//             onClick={() => setActiveTab("approvedEnrollments")}
//           >
//             👤 Approved Enrollments
//           </button>
//         </div>

//         {/* Pending Users Tab */}
//         {user.role === "admin" && activeTab === "pendingUsers" && (
//           <div>
//             <h3>Pending Users</h3>
//             <table className="user-table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Role</th>
//                   <th>Subject</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pendingUsers.map((user) => (
//                   <tr key={user.id}>
//                     <td>{user.name}</td>
//                     <td>{user.email}</td>
//                     <td>{user.role}</td>
//                     <td>{user.subject}</td>
//                     <td>
//                       <button
//                         className="btn-action btn-approve"
//                         onClick={async () => {
//                           if (window.confirm(`Approve ${user.name}?`)) {
//                             try {
//                               await axios.post(
//                                 `${API_BASE_URL}/api/v1/users/approve/${user.id}`,
//                                 {},
//                                 {
//                                   headers: {
//                                     Authorization: `Bearer ${localStorage.getItem(
//                                       "token"
//                                     )}`,
//                                   },
//                                 }
//                               );
//                               toast.success("User approved");
//                               fetchPendingUsers();
//                             } catch (err) {
//                               toast.error("Failed to approve user");
//                             }
//                           }
//                         }}
//                       >
//                         ✅ Approve
//                       </button>
//                       <button
//                         className="btn-action btn-reject"
//                         onClick={async () => {
//                           if (window.confirm(`Reject ${user.name}?`)) {
//                             try {
//                               await axios.post(
//                                 `${API_BASE_URL}/api/v1/users/reject/${user.id}`,
//                                 {},
//                                 {
//                                   headers: {
//                                     Authorization: `Bearer ${localStorage.getItem(
//                                       "token"
//                                     )}`,
//                                   },
//                                 }
//                               );
//                               toast.success("User rejected");
//                               fetchPendingUsers();
//                             } catch (err) {
//                               toast.error("Failed to reject user");
//                             }
//                           }
//                         }}
//                       >
//                         ❌ Reject
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pending Enrollments Tab */}
//         {activeTab === "pendingEnrollments" && (
//           <>
//             <h3>Pending Enrollments</h3>
//             <div className="dashboard-actions">
//               <button className="btn-secondary" onClick={exportToCSV}>
//                 📤 Export Enrollments to CSV
//               </button>
//               <button
//                 className="btn-secondary"
//                 onClick={() => setSortNewestFirst(!sortNewestFirst)}
//               >
//                 📅 Sort by {sortNewestFirst ? "Oldest" : "Newest"}
//               </button>
//               <select
//                 value={courseFilter}
//                 onChange={(e) => setCourseFilter(e.target.value)}
//               >
//                 <option value="">All Courses</option>
//                 {allCourses.map((title) => (
//                   <option key={title} value={title}>
//                     {title}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="filter-boxes">
//               <input
//                 type="text"
//                 placeholder="Search by student name..."
//                 value={studentFilter}
//                 onChange={(e) => setStudentFilter(e.target.value)}
//               />
//             </div>

//             <table className="user-table">
//               <thead>
//                 <tr>
//                   <th>Student</th>
//                   <th>Email</th>
//                   <th>Course</th>
//                   <th>Access Requested</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered(pendingEnrollments).map((e) => (
//                   <tr key={`${e.userId}-${e.courseId}`}>
//                     <td>{e.user?.name}</td>
//                     <td>{e.user?.email}</td>
//                     <td>{e.course?.title}</td>
//                     <td>{new Date(e.accessGrantedAt).toLocaleString()}</td>
//                     <td>⏳ Pending</td>
//                     <td>
//                       <button
//                         className="btn-primary"
//                         onClick={() =>
//                           handleApproveEnrollment(e.userId, e.courseId)
//                         }
//                       >
//                         Approve
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </>
//         )}

//         {/* Approved Enrollments Tab */}
//         {activeTab === "approvedEnrollments" && (
//           <>
//             <h3>Approved Enrollments</h3>
//             <table className="user-table">
//               <thead>
//                 <tr>
//                   <th>Student</th>
//                   <th>Email</th>
//                   <th>Course</th>
//                   <th>Access Granted</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered(approvedEnrollments).map((e) => (
//                   <tr key={`${e.userId}-${e.courseId}`}>
//                     <td>{e.user?.name}</td>
//                     <td>{e.user?.email}</td>
//                     <td>{e.course?.title}</td>
//                     <td>{new Date(e.accessGrantedAt).toLocaleString()}</td>
//                     <td>✅ Approved</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;





// AdminDashboard.jsx

import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = ({ onLogout }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [studentFilter, setStudentFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [activeTab, setActiveTab] = useState("pendingUsers");
  const [darkMode, setDarkMode] = useState(false);

  const handleError = useCallback(
    (err, setError) => {
      const status = err.response?.status;
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        onLogout();
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else {
        toast.error("Something went wrong");
        setError("Something went wrong");
      }
    },
    [navigate, onLogout]
  );

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (user.role === "admin") {
        const [pendingRes, approvedRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/v1/users/pending`, { headers }),
          axios.get(`${API_BASE_URL}/api/v1/enrollments/approved`, { headers }),
          axios.get(`${API_BASE_URL}/api/v1/users/approved`, { headers }),
        ]);
        setPendingUsers(pendingRes.data);
        setApprovedEnrollments(approvedRes.data);
        setApprovedUsers(usersRes.data);
      }

      if (["admin", "teacher"].includes(user.role)) {
        const [pendingEnrollmentsRes, approvedEnrollmentsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/v1/enrollments/pending`, { headers }),
          axios.get(`${API_BASE_URL}/api/v1/enrollments/approved`, { headers }),
        ]);
        setPendingEnrollments(pendingEnrollmentsRes.data);
        setApprovedEnrollments(approvedEnrollmentsRes.data);
      }
    } catch (err) {
      handleError(err, () => {});
    }
  };

  const handleApproveEnrollment = async (userId, courseId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/v1/enrollments/approve`,
        { userId, courseId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("Enrollment approved");
      fetchData();
    } catch (err) {
      handleError(err, () => {});
    }
  };

  const exportToCSV = () => {
    const rows = [...pendingEnrollments, ...approvedEnrollments];
    const headers = ["Student", "Email", "Course", "AccessGrantedAt", "Status"];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) =>
        [
          e.user?.name,
          e.user?.email,
          e.course?.title,
          new Date(e.accessGrantedAt).toLocaleString(),
          approvedEnrollments.includes(e) ? "Approved" : "Pending",
        ].join(",")
      )].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "enrollments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const filtered = (arr) =>
    arr
      .filter(
        (e) =>
          e.user?.name.toLowerCase().includes(studentFilter.toLowerCase()) &&
          (courseFilter ? e.course?.title === courseFilter : true)
      )
      .sort((a, b) =>
        sortNewestFirst
          ? new Date(b.accessGrantedAt) - new Date(a.accessGrantedAt)
          : new Date(a.accessGrantedAt) - new Date(b.accessGrantedAt)
      );

  if (!user || (user.role !== "admin" && user.role !== "teacher")) {
    return <div className="unauthorized">Unauthorized</div>;
  }

  const allCourses = Array.from(
    new Set([...pendingEnrollments, ...approvedEnrollments].map(e => e.course?.title).filter(Boolean))
  ).sort();

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h2>{user.role === "admin" ? "Admin Dashboard" : "Teacher Dashboard"}</h2>
          <div>
            <button onClick={() => setDarkMode(!darkMode)} className="btn-secondary">
              {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>
            <button onClick={onLogout} className="btn-secondary logout-btn">Logout</button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          {user.role === "admin" && (
            <>
              <div className="summary-card">👩‍🎓 Total Students<br />{approvedUsers.length}</div>
              <div className="summary-card">🕒 Pending Users<br />{pendingUsers.length}</div>
            </>
          )}
          <div className="summary-card">📥 Pending Enrollments<br />{pendingEnrollments.length}</div>
          <div className="summary-card">✅ Approved Enrollments<br />{approvedEnrollments.length}</div>
        </div>

        {/* Tab Buttons */}
        <div className="admin-tabs">
          {user.role === "admin" && (
            <button
              className={`tab-button ${activeTab === "pendingUsers" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("pendingUsers")}
            >
              👤 Pending Users
            </button>
          )}
          <button
            className={`tab-button ${activeTab === "pendingEnrollments" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("pendingEnrollments")}
          >
            📥 Pending Enrollments
          </button>
          <button
            className={`tab-button ${activeTab === "approvedEnrollments" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("approvedEnrollments")}
          >
            ✅ Approved Enrollments
          </button>
        </div>

        {/* Add your tab content below as before... */}
        {/* You can keep the same table JSX from your earlier implementation */}
      </div>
    </div>
  );
};

export default AdminDashboard;

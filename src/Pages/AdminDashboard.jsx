
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
//   const [approvedUsers, setApprovedUsers] = useState([]);
//   const [pendingEnrollments, setPendingEnrollments] = useState([]);
//   const [approvedEnrollments, setApprovedEnrollments] = useState([]);
//   const [studentFilter, setStudentFilter] = useState("");
//   const [courseFilter, setCourseFilter] = useState("");
//   const [sortNewestFirst, setSortNewestFirst] = useState(true);
//   const [activeTab, setActiveTab] = useState("pendingUsers");
//   const [darkMode, setDarkMode] = useState(false);
//   const [pendingUserSearch, setPendingUserSearch] = useState("");
//   const [pendingUserSubjectFilter, setPendingUserSubjectFilter] = useState("");

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

//   const fetchData = useCallback(async () => {
//     const token = localStorage.getItem("token");
//     const headers = { Authorization: `Bearer ${token}` };

//     try {
//       if (user.role === "admin") {
//         const [pendingUsersRes, approvedUsersRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/api/v1/users/pending`, { headers }),
//           axios.get(`${API_BASE_URL}/api/v1/users/approved`, { headers }),
//         ]);
//         setPendingUsers(
//           Array.isArray(pendingUsersRes.data) ? pendingUsersRes.data : []
//         );
//         setApprovedUsers(
//           Array.isArray(approvedUsersRes.data) ? approvedUsersRes.data : []
//         );
//       }

//       if (["admin", "teacher"].includes(user.role)) {
//         const [pendingEnrollmentsRes, approvedEnrollmentsRes] =
//           await Promise.all([
//             axios.get(`${API_BASE_URL}/api/v1/enrollments/pending`, {
//               headers,
//             }),
//             axios.get(`${API_BASE_URL}/api/v1/enrollments/approved`, {
//               headers,
//             }),
//           ]);
//           setPendingEnrollments(
//             Array.isArray(pendingEnrollmentsRes.data.enrollments)
//               ? pendingEnrollmentsRes.data.enrollments
//               : []
//           );

//           setApprovedEnrollments(
//             Array.isArray(approvedEnrollmentsRes.data.enrollments)
//               ? approvedEnrollmentsRes.data.enrollments
//               : []
//           );
          
//       }
//     } catch (err) {
//       handleError(err, () => {});
//     }
//   }, [user.role, handleError]);

//   useEffect(() => {
//     if (user && user.role) {
//       fetchData();
//     }
//   }, [user, fetchData]);
  

//   const handleApproveEnrollment = async (userId, courseId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `${API_BASE_URL}/api/v1/enrollments/approve`,
//         { userId, courseId },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success("Enrollment approved");
//       fetchData();
//     } catch (err) {
//       handleError(err, () => {});
//     }
//   };

//   // CSV Export functions
//   const downloadCSV = (csvString, filename) => {
//     const uri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvString);
//     const link = document.createElement("a");
//     link.setAttribute("href", uri);
//     link.setAttribute("download", filename);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const exportPendingUsersToCSV = () => {
//     const headers = ["Name", "Email", "Role", "Subject"];
//     const csv = [
//       headers.join(","),
//       ...pendingUsers.map((u) =>
//         [u.name, u.email, u.role, u.subject].join(",")
//       ),
//     ].join("\n");
//     downloadCSV(csv, "pending_users.csv");
//   };

//   const exportApprovedUsersToCSV = () => {
//     const headers = ["Name", "Email", "Subject"];
//     const csv = [
//       headers.join(","),
//       ...approvedUsers.map((u) => [u.name, u.email, u.subject].join(",")),
//     ].join("\n");
//     downloadCSV(csv, "approved_students.csv");
//   };

//   const exportPendingEnrollmentsToCSV = () => {
//     const headers = ["Student", "Email", "Course", "AccessRequested", "Status"];
//     const csv = [
//       headers.join(","),
//       ...pendingEnrollments.map((e) =>
//         [
//           e.user?.name,
//           e.user?.email,
//           e.course?.title,
//           new Date(e.accessGrantedAt).toLocaleString(),
//           "Pending",
//         ].join(",")
//       ),
//     ].join("\n");
//     downloadCSV(csv, "pending_enrollments.csv");
//   };

//   const exportApprovedEnrollmentsToCSV = () => {
//     const headers = ["Student", "Email", "Course", "AccessGranted", "Status"];
//     const csv = [
//       headers.join(","),
//       ...approvedEnrollments.map((e) =>
//         [
//           e.user?.name,
//           e.user?.email,
//           e.course?.title,
//           new Date(e.accessGrantedAt).toLocaleString(),
//           "Approved",
//         ].join(",")
//       ),
//     ].join("\n");
//     downloadCSV(csv, "approved_enrollments.csv");
//   };




//   let allCourses = [];

//   try {
//     const pending = Array.isArray(pendingEnrollments) ? pendingEnrollments : [];
//     const approved = Array.isArray(approvedEnrollments)
//       ? approvedEnrollments
//       : [];

//     allCourses = Array.from(
//       new Set(
//         [...pending, ...approved].map((e) => e?.course?.title).filter(Boolean)
//       )
//     ).sort();
//   } catch (e) {
//     console.error("Error building allCourses:", e);
//     allCourses = [];
//   }


//   const filtered = (arr) =>
//     (arr || [])
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

//   const pendingUserSubjects = Array.from(
//     new Set(pendingUsers.map((u) => u.subject).filter(Boolean))
//   ).sort();

//   const filteredPendingUsers = pendingUsers.filter(
//     (u) =>
//       u.name.toLowerCase().includes(pendingUserSearch.toLowerCase()) &&
//       (!pendingUserSubjectFilter || u.subject === pendingUserSubjectFilter)
//   );

//   if (!user || (user.role !== "admin" && user.role !== "teacher")) {
//     return <div className="unauthorized">Unauthorized</div>;
//   }

//   return (
//     <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
//       {/* ...the rest of your JSX component code remains unchanged */}
//       {/* Place JSX structure you already have here including all rendering logic */}
//       <div className="dashboard-card">
//         <div className="dashboard-header">
//           <h2>
//             {user.role === "admin" ? "Admin Dashboard" : "Teacher Dashboard"}
//           </h2>
//           <div>
//             <button
//               onClick={() => setDarkMode(!darkMode)}
//               className="btn-secondary"
//             >
//               {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
//             </button>
//             <button onClick={onLogout} className="btn-secondary logout-btn">
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="summary-cards">
//           {user.role === "admin" && (
//             <>
//               <div className="summary-card">
//                 👩🎓 Total Students
//                 <br />
//                 {approvedUsers.length}
//               </div>
//               <div className="summary-card">
//                 🕒 Pending Users
//                 <br />
//                 {pendingUsers.length}
//               </div>
//             </>
//           )}
//           <div className="summary-card">
//             📥 Pending Enrollments
//             <br />
//             {(pendingEnrollments || []).length}
//           </div>
//           <div className="summary-card">
//             ✅ Approved Enrollments
//             <br />
//             {(approvedEnrollments || []).length}
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="admin-tabs">
//           {user.role === "admin" && (
//             <>
//               <button
//                 className={`tab-button ${
//                   activeTab === "pendingUsers" ? "tab-active" : ""
//                 }`}
//                 onClick={() => setActiveTab("pendingUsers")}
//               >
//                 👤 Pending Users
//               </button>
//               <button
//                 className={`tab-button ${
//                   activeTab === "approvedUsers" ? "tab-active" : ""
//                 }`}
//                 onClick={() => setActiveTab("approvedUsers")}
//               >
//                 👨🎓 Total Students
//               </button>
//             </>
//           )}
//           <button
//             className={`tab-button ${
//               activeTab === "pendingEnrollments" ? "tab-active" : ""
//             }`}
//             onClick={() => setActiveTab("pendingEnrollments")}
//           >
//             📥 Pending Enrollments
//           </button>
//           <button
//             className={`tab-button ${
//               activeTab === "approvedEnrollments" ? "tab-active" : ""
//             }`}
//             onClick={() => setActiveTab("approvedEnrollments")}
//           >
//             ✅ Approved Enrollments
//           </button>
//         </div>

//         {/* Pending Users Tab */}
//         {user.role === "admin" && activeTab === "pendingUsers" && (
//           <>
//             <h3>Pending Users</h3>
//             <div className="dashboard-actions">
//               <button
//                 className="btn-secondary"
//                 onClick={exportPendingUsersToCSV}
//               >
//                 📤 Export Pending Users to CSV
//               </button>
//               <select
//                 value={pendingUserSubjectFilter}
//                 onChange={(e) => setPendingUserSubjectFilter(e.target.value)}
//               >
//                 <option value="">All Subjects</option>
//                 {pendingUserSubjects.map((subject) => (
//                   <option key={subject} value={subject}>
//                     {subject}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="filter-boxes">
//               <input
//                 type="text"
//                 placeholder="Search by name..."
//                 value={pendingUserSearch}
//                 onChange={(e) => setPendingUserSearch(e.target.value)}
//               />
//             </div>
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
//                 {filteredPendingUsers.map((u) => (
//                   <tr key={u.id}>
//                     <td>{u.name}</td>
//                     <td>{u.email}</td>
//                     <td>{u.role}</td>
//                     <td>{u.subject}</td>
//                     <td>
//                       <button
//                         className="btn-action btn-approve"
//                         onClick={async () => {
//                           if (window.confirm(`Approve ${u.name}?`)) {
//                             try {
//                               await axios.post(
//                                 `${API_BASE_URL}/api/v1/users/approve/${u.id}`,
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
//                               fetchData();
//                             } catch {
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
//                           if (window.confirm(`Reject ${u.name}?`)) {
//                             try {
//                               await axios.post(
//                                 `${API_BASE_URL}/api/v1/users/reject/${u.id}`,
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
//                               fetchData();
//                             } catch {
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
//           </>
//         )}

//         {/* Total Students Tab */}
//         {user.role === "admin" && activeTab === "approvedUsers" && (
//           <>
//             <h3>Total Approved Students</h3>
//             <div className="dashboard-actions">
//               <button
//                 className="btn-secondary"
//                 onClick={exportApprovedUsersToCSV}
//               >
//                 📤 Export Approved Students to CSV
//               </button>
//               <select
//                 value={courseFilter}
//                 onChange={(e) => setCourseFilter(e.target.value)}
//               >
//                 <option value="">All Subjects</option>
//                 {Array.from(new Set(approvedUsers.map((u) => u.subject))).map(
//                   (subject) => (
//                     <option key={subject} value={subject}>
//                       {subject}
//                     </option>
//                   )
//                 )}
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
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Subject</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {approvedUsers
//                   .filter(
//                     (u) =>
//                       u.name
//                         .toLowerCase()
//                         .includes(studentFilter.toLowerCase()) &&
//                       (!courseFilter || u.subject === courseFilter)
//                   )
//                   .map((u) => (
//                     <tr key={u.id}>
//                       <td>{u.name}</td>
//                       <td>{u.email}</td>
//                       <td>{u.subject}</td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </>
//         )}

//         {/* Pending Enrollments Tab */}
//         {activeTab === "pendingEnrollments" && (
//           <>
//             <h3>Pending Enrollments</h3>
//             <div className="dashboard-actions">
//               <button
//                 className="btn-secondary"
//                 onClick={exportPendingEnrollmentsToCSV}
//               >
//                 📤 Export Pending Enrollments to CSV
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
//             <div className="dashboard-actions">
//               <button
//                 className="btn-secondary"
//                 onClick={exportApprovedEnrollmentsToCSV}
//               >
//                 📤 Export Approved Enrollments to CSV
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




import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
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
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [studentFilter, setStudentFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [activeTab, setActiveTab] = useState("pendingUsers");
  const [darkMode, setDarkMode] = useState(false);
  const [pendingUserSearch, setPendingUserSearch] = useState("");
  const [pendingUserSubjectFilter, setPendingUserSubjectFilter] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const handleError = useCallback(
    (err) => {
      const status = err.response?.status;
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        onLogout();
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else {
        toast.error("Something went wrong");
      }
    },
    [navigate, onLogout]
  );

  const extractList = (res) => {
    if (!res || !res.data) return [];
    if (Array.isArray(res.data.enrollments)) return res.data.enrollments;
    if (Array.isArray(res.data)) return res.data;
    return [];
  };

  const fetchData = useCallback(async () => {
    if (!user || !user.role) return;
    const headers = getAuthHeaders();

    try {
      if (user.role === "admin") {
        const [pendingUsersRes, approvedUsersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/v1/users/pending`, { headers }),
          axios.get(`${API_BASE_URL}/api/v1/users/approved`, { headers }),
        ]);
        setPendingUsers(extractList(pendingUsersRes));
        setApprovedUsers(extractList(approvedUsersRes));
      }

      if (["admin", "teacher"].includes(user.role)) {
        const [pendingEnrollmentsRes, approvedEnrollmentsRes] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/api/v1/admin/enrollments/pending`, {
              headers,
            }),
            axios.get(`${API_BASE_URL}/api/v1/admin/enrollments/approved`, {
              headers,
            }),
          ]);

        setPendingEnrollments(extractList(pendingEnrollmentsRes));
        setApprovedEnrollments(extractList(approvedEnrollmentsRes));
      }
    } catch (err) {
      handleError(err);
    }
  }, [user, handleError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApproveEnrollment = async (id) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/v1/admin/enrollments/${id}/approve`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success("Enrollment approved");
      fetchData();
    } catch (err) {
      handleError(err);
    }
  };

  const handleRejectEnrollment = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/admin/enrollments/${id}`, {
        headers: getAuthHeaders(),
      });
      toast.info("Enrollment rejected");
      fetchData();
    } catch (err) {
      handleError(err);
    }
  };

  // CSV helpers
  const downloadCSV = (csvString, filename) => {
    const uri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvString);
    const link = document.createElement("a");
    link.setAttribute("href", uri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPendingEnrollmentsToCSV = () => {
    const headers = ["Student", "Email", "Course", "AccessRequested", "Status"];
    const csv = [
      headers.join(","),
      ...pendingEnrollments.map((e) =>
        [
          e.User?.name,
          e.User?.email,
          e.Course?.title,
          new Date(e.accessGrantedAt).toLocaleString(),
          "Pending",
        ]
          .map((v) => `"${v ?? ""}"`)
          .join(",")
      ),
    ].join("\n");
    downloadCSV(csv, "pending_enrollments.csv");
  };

  const exportApprovedEnrollmentsToCSV = () => {
    const headers = ["Student", "Email", "Course", "AccessGranted", "Status"];
    const csv = [
      headers.join(","),
      ...approvedEnrollments.map((e) =>
        [
          e.User?.name,
          e.User?.email,
          e.Course?.title,
          new Date(e.accessGrantedAt).toLocaleString(),
          "Approved",
        ]
          .map((v) => `"${v ?? ""}"`)
          .join(",")
      ),
    ].join("\n");
    downloadCSV(csv, "approved_enrollments.csv");
  };

  const allCourses = useMemo(() => {
    const titles = [...pendingEnrollments, ...approvedEnrollments]
      .map((e) => e.Course?.title)
      .filter(Boolean);
    return Array.from(new Set(titles)).sort();
  }, [pendingEnrollments, approvedEnrollments]);

  const filtered = (arr) =>
    (arr || [])
      .filter(
        (e) =>
          (e.User?.name || "")
            .toLowerCase()
            .includes(studentFilter.toLowerCase()) &&
          (courseFilter ? e.Course?.title === courseFilter : true)
      )
      .sort((a, b) =>
        sortNewestFirst
          ? new Date(b.accessGrantedAt) - new Date(a.accessGrantedAt)
          : new Date(a.accessGrantedAt) - new Date(b.accessGrantedAt)
      );

  if (!user || (user.role !== "admin" && user.role !== "teacher")) {
    return <div className="unauthorized">Unauthorized</div>;
  }

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h2>
            {user.role === "admin" ? "Admin Dashboard" : "Teacher Dashboard"}
          </h2>
          <div className="header-actions">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="btn-secondary"
            >
              {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>
            <button onClick={onLogout} className="btn-secondary logout-btn">
              Logout
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          {user.role === "admin" && (
            <>
              <div className="summary-card">
                👩🎓 Total Students
                <br />
                {approvedUsers.length}
              </div>
              <div className="summary-card">
                🕒 Pending Users
                <br />
                {pendingUsers.length}
              </div>
            </>
          )}
          <div className="summary-card">
            📥 Pending Enrollments
            <br />
            {pendingEnrollments.length}
          </div>
          <div className="summary-card">
            ✅ Approved Enrollments
            <br />
            {approvedEnrollments.length}
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {user.role === "admin" && (
            <>
              <button
                className={`tab-button ${
                  activeTab === "pendingUsers" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("pendingUsers")}
              >
                👤 Pending Users
              </button>
              <button
                className={`tab-button ${
                  activeTab === "approvedUsers" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("approvedUsers")}
              >
                👨🎓 Total Students
              </button>
            </>
          )}
          <button
            className={`tab-button ${
              activeTab === "pendingEnrollments" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("pendingEnrollments")}
          >
            📥 Pending Enrollments
          </button>
          <button
            className={`tab-button ${
              activeTab === "approvedEnrollments" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("approvedEnrollments")}
          >
            ✅ Approved Enrollments
          </button>
        </div>

        {/* Pending Enrollments */}
        {activeTab === "pendingEnrollments" && (
          <>
            <h3>Pending Enrollments</h3>
            <div className="dashboard-actions">
              <button
                className="btn-secondary"
                onClick={exportPendingEnrollmentsToCSV}
              >
                📤 Export to CSV
              </button>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                <option value="">All Courses</option>
                {allCourses.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-boxes">
              <input
                type="text"
                placeholder="Search by student name..."
                value={studentFilter}
                onChange={(e) => setStudentFilter(e.target.value)}
              />
            </div>

            <table className="user-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Requested</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered(pendingEnrollments).map((e) => (
                  <tr key={e.id}>
                    <td>{e.User?.name}</td>
                    <td>{e.User?.email}</td>
                    <td>{e.Course?.title}</td>
                    <td>{new Date(e.accessGrantedAt).toLocaleString()}</td>
                    <td>⏳ Pending</td>
                    <td>
                      <button
                        className="btn-primary"
                        onClick={() => handleApproveEnrollment(e.id)}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="btn-action btn-reject"
                        onClick={() => handleRejectEnrollment(e.id)}
                      >
                        ❌ Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Approved Enrollments */}
        {activeTab === "approvedEnrollments" && (
          <>
            <h3>Approved Enrollments</h3>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Granted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered(approvedEnrollments).map((e) => (
                  <tr key={e.id}>
                    <td>{e.User?.name}</td>
                    <td>{e.User?.email}</td>
                    <td>{e.Course?.title}</td>
                    <td>{new Date(e.accessGrantedAt).toLocaleString()}</td>
                    <td>✅ Approved</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

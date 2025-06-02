
// import React, { useState, useEffect, useCallback, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { API_BASE_URL } from "../config";
// import { AuthContext } from "../context/AuthContext";
// // import PendingUsers from "../components/PendingUsers";

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

//   if (!user || (user.role !== "admin" && user.role !== "teacher")) {
//     return <div className="unauthorized">Unauthorized</div>;
//   }
//   {
//     user.role === "admin" && (
//       <PendingUsers users={pendingUsers} refreshUsers={fetchPendingUsers} />
//     );
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

//         <div className="summary-cards">
//           {user.role === "admin" && (
//             <div className="summary-card">
//               <strong>Pending Users:</strong> {pendingUsers.length}
//             </div>
//           )}
//           <div className="summary-card">
//             <strong>Pending Enrollments:</strong> {pendingEnrollments.length}
//           </div>
//           <div className="summary-card">
//             <strong>Approved Enrollments:</strong> {approvedEnrollments.length}
//           </div>
//         </div>
//         {user.role === "admin" && (
//           <div style={{ marginTop: "2rem" }}>
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
//                           try {
//                             await axios.post(
//                               `${API_BASE_URL}/api/v1/users/approve/${user.id}`,
//                               {},
//                               {
//                                 headers: {
//                                   Authorization: `Bearer ${localStorage.getItem(
//                                     "token"
//                                   )}`,
//                                 },
//                               }
//                             );
//                             toast.success("User approved");
//                             fetchPendingUsers();
//                           } catch (err) {
//                             toast.error("Failed to approve user");
//                           }
//                         }}
//                       >
//                         ✅ Approve
//                       </button>
//                       <button
//                         className="btn-action btn-reject"
//                         onClick={async () => {
//                           try {
//                             await axios.post(
//                               `${API_BASE_URL}/api/v1/users/reject/${user.id}`,
//                               {},
//                               {
//                                 headers: {
//                                   Authorization: `Bearer ${localStorage.getItem(
//                                     "token"
//                                   )}`,
//                                 },
//                               }
//                             );
//                             toast.success("User rejected");
//                             fetchPendingUsers();
//                           } catch (err) {
//                             toast.error("Failed to reject user");
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

//         {user.role === "admin" && (
//           <div className="dashboard-section">
//             <h3
//               className="section-header"
//               onClick={() => setShowPendingUsers(!showPendingUsers)}
//             >
//               📋 Pending Users ({pendingUsers.length}){" "}
//               <span>{showPendingUsers ? "▲" : "▼"}</span>
//             </h3>

//             {showPendingUsers && (
//               <table className="user-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Role</th>
//                     <th>Subject</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {pendingUsers.map((user) => (
//                     <tr key={user.id}>
//                       <td>{user.name}</td>
//                       <td>{user.email}</td>
//                       <td>{user.role}</td>
//                       <td>{user.subject}</td>
//                       <td>
//                         {successActions[user.id] === "approved" &&
//                           "✅ Approved"}
//                         {successActions[user.id] === "rejected" &&
//                           "❌ Rejected"}
//                       </td>
//                       <td>
//                         {user.loading ? (
//                           <span>⏳ Processing...</span>
//                         ) : !successActions[user.id] ? (
//                           <>
//                             <button
//                               className="btn-action btn-approve"
//                               disabled={user.loading}
//                               onClick={async () => {
//                                 if (window.confirm(`Approve ${user.name}?`)) {
//                                   const updatedUsers = pendingUsers.map((u) =>
//                                     u.id === user.id
//                                       ? { ...u, loading: true }
//                                       : u
//                                   );
//                                   setPendingUsers(updatedUsers);
//                                   try {
//                                     await axios.post(
//                                       `${API_BASE_URL}/api/v1/users/approve/${user.id}`,
//                                       {},
//                                       {
//                                         headers: {
//                                           Authorization: `Bearer ${localStorage.getItem(
//                                             "token"
//                                           )}`,
//                                         },
//                                       }
//                                     );
//                                     toast.success("User approved");
//                                     setSuccessActions((prev) => ({
//                                       ...prev,
//                                       [user.id]: "approved",
//                                     }));
//                                     fetchPendingUsers();
//                                   } catch (err) {
//                                     toast.error("Failed to approve user");
//                                   }
//                                 }
//                               }}
//                             >
//                               ✅ Approve
//                             </button>

//                             <button
//                               className="btn-action btn-reject"
//                               disabled={user.loading}
//                               onClick={async () => {
//                                 if (window.confirm(`Reject ${user.name}?`)) {
//                                   const updatedUsers = pendingUsers.map((u) =>
//                                     u.id === user.id
//                                       ? { ...u, loading: true }
//                                       : u
//                                   );
//                                   setPendingUsers(updatedUsers);
//                                   try {
//                                     await axios.post(
//                                       `${API_BASE_URL}/api/v1/users/reject/${user.id}`,
//                                       {},
//                                       {
//                                         headers: {
//                                           Authorization: `Bearer ${localStorage.getItem(
//                                             "token"
//                                           )}`,
//                                         },
//                                       }
//                                     );
//                                     toast.success("User rejected");
//                                     setSuccessActions((prev) => ({
//                                       ...prev,
//                                       [user.id]: "rejected",
//                                     }));
//                                     fetchPendingUsers();
//                                   } catch (err) {
//                                     toast.error("Failed to reject user");
//                                   }
//                                 }
//                               }}
//                             >
//                               ❌ Reject
//                             </button>
//                           </>
//                         ) : (
//                           <span style={{ color: "#777" }}>Done</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}


//         <h3>Course Enrollments</h3>

//         <div className="dashboard-actions">
//           <button className="btn-secondary" onClick={exportToCSV}>
//             📤 Export Enrollments to CSV
//           </button>
//           <button
//             className="btn-secondary"
//             onClick={() => setSortNewestFirst(!sortNewestFirst)}
//           >
//             📅 Sort by {sortNewestFirst ? "Oldest" : "Newest"}
//           </button>
//           <select
//             value={courseFilter}
//             onChange={(e) => setCourseFilter(e.target.value)}
//           >
//             <option value="">All Courses</option>
//             {allCourses.map((title) => (
//               <option key={title} value={title}>
//                 {title}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="filter-boxes">
//           <input
//             type="text"
//             placeholder="Search by student name..."
//             value={studentFilter}
//             onChange={(e) => setStudentFilter(e.target.value)}
//           />
//         </div>

//         <table className="user-table">
//           <thead>
//             <tr>
//               <th>Student</th>
//               <th>Email</th>
//               <th>Course</th>
//               <th>Access Requested</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered([...pendingEnrollments, ...approvedEnrollments]).map(
//               (e) => (
//                 <tr key={`${e.userId}-${e.courseId}`}>
//                   <td>{e.user?.name}</td>
//                   <td>{e.user?.email}</td>
//                   <td>{e.course?.title}</td>
//                   <td>{new Date(e.accessGrantedAt).toLocaleString()}</td>
//                   <td>
//                     {approvedEnrollments.includes(e)
//                       ? "✅ Approved"
//                       : "⏳ Pending"}
//                   </td>
//                   <td>
//                     {!approvedEnrollments.includes(e) && (
//                       <button
//                         className="btn-primary"
//                         onClick={() =>
//                           handleApproveEnrollment(e.userId, e.courseId)
//                         }
//                       >
//                         Approve
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               )
//             )}
//           </tbody>
//         </table>
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

  const [studentFilter, setStudentFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [activeTab, setActiveTab] = useState("pendingUsers");
  const [successActions, setSuccessActions] = useState({});

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

  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/v1/users/pending`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setPendingUsers(res.data);
    } catch (err) {
      handleError(err, () => {});
    }
  };

  const fetchPendingEnrollments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/v1/enrollments/pending`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setPendingEnrollments(res.data);
    } catch (err) {
      handleError(err, () => {});
    }
  };

  const fetchApprovedEnrollments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/v1/enrollments/approved`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setApprovedEnrollments(res.data);
    } catch (err) {
      handleError(err, () => {});
    }
  };

  const handleApproveEnrollment = async (userId, courseId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/api/v1/enrollments/approve`, { userId, courseId }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success("Enrollment approved");
      fetchPendingEnrollments();
      fetchApprovedEnrollments();
    } catch (err) {
      handleError(err, () => {});
    }
  };

  const exportToCSV = () => {
    const rows = [...pendingEnrollments, ...approvedEnrollments];
    const headers = ["Student", "Email", "Course", "AccessGrantedAt", "Status"];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rows.map((e) =>
          [
            e.user?.name,
            e.user?.email,
            e.course?.title,
            new Date(e.accessGrantedAt).toLocaleString(),
            approvedEnrollments.includes(e) ? "Approved" : "Pending",
          ].join(",")
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "enrollments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (!user) return;
    if (user.role === "admin") fetchPendingUsers();
    if (["admin", "teacher"].includes(user.role)) {
      fetchPendingEnrollments();
      fetchApprovedEnrollments();
    }
  }, [user]);

  if (!user || (user.role !== "admin" && user.role !== "teacher")) {
    return <div className="unauthorized">Unauthorized</div>;
  }

  const allCourses = Array.from(
    new Set(
      [...pendingEnrollments, ...approvedEnrollments]
        .map((e) => e.course?.title)
        .filter(Boolean)
    )
  ).sort();

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

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>{user.role === "admin" ? "Admin Dashboard" : "Teacher Dashboard"}</h2>
        <button onClick={onLogout} className="btn-secondary logout-btn">
          Logout
        </button>

        <div className="admin-tabs">
          {user.role === "admin" && (
            <button
              className={activeTab === "pendingUsers" ? "tab-active" : ""}
              onClick={() => setActiveTab("pendingUsers")}
            >
              Pending Users
            </button>
          )}
          <button
            className={activeTab === "pendingEnrollments" ? "tab-active" : ""}
            onClick={() => setActiveTab("pendingEnrollments")}
          >
            Pending Enrollments
          </button>
          <button
            className={activeTab === "approvedEnrollments" ? "tab-active" : ""}
            onClick={() => setActiveTab("approvedEnrollments")}
          >
            Approved Enrollments
          </button>
        </div>

        {user.role === "admin" && activeTab === "pendingUsers" && (
          <div className="dashboard-section">
            <h3>Pending Users</h3>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.subject}</td>
                    <td>
                      {successActions[user.id] === "approved" && "✅ Approved"}
                      {successActions[user.id] === "rejected" && "❌ Rejected"}
                    </td>
                    <td>
                      {user.loading ? (
                        <span>⏳ Processing...</span>
                      ) : !successActions[user.id] ? (
                        <>
                          <button
                            className="btn-action btn-approve"
                            disabled={user.loading}
                            onClick={async () => {
                              if (window.confirm(`Approve ${user.name}?`)) {
                                const updatedUsers = pendingUsers.map((u) =>
                                  u.id === user.id ? { ...u, loading: true } : u
                                );
                                setPendingUsers(updatedUsers);
                                try {
                                  await axios.post(
                                    `${API_BASE_URL}/api/v1/users/approve/${user.id}`,
                                    {},
                                    {
                                      headers: {
                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                      },
                                    }
                                  );
                                  toast.success("User approved");
                                  setSuccessActions((prev) => ({
                                    ...prev,
                                    [user.id]: "approved",
                                  }));
                                  fetchPendingUsers();
                                } catch (err) {
                                  toast.error("Failed to approve user");
                                }
                              }
                            }}
                          >
                            ✅ Approve
                          </button>
                          <button
                            className="btn-action btn-reject"
                            disabled={user.loading}
                            onClick={async () => {
                              if (window.confirm(`Reject ${user.name}?`)) {
                                const updatedUsers = pendingUsers.map((u) =>
                                  u.id === user.id ? { ...u, loading: true } : u
                                );
                                setPendingUsers(updatedUsers);
                                try {
                                  await axios.post(
                                    `${API_BASE_URL}/api/v1/users/reject/${user.id}`,
                                    {},
                                    {
                                      headers: {
                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                      },
                                    }
                                  );
                                  toast.success("User rejected");
                                  setSuccessActions((prev) => ({
                                    ...prev,
                                    [user.id]: "rejected",
                                  }));
                                  fetchPendingUsers();
                                } catch (err) {
                                  toast.error("Failed to reject user");
                                }
                              }
                            }}
                          >
                            ❌ Reject
                          </button>
                        </>
                      ) : (
                        <span style={{ color: "#777" }}>Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "pendingEnrollments" && (
          <>
            <h3>Pending Enrollments</h3>
            {/* Add your filtered enrollments table here */}
          </>
        )}

        {activeTab === "approvedEnrollments" && (
          <>
            <h3>Approved Enrollments</h3>
            {/* Add your approved enrollments table here */}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

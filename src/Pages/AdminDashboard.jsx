


// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { API_BASE_URL } from "../config";
// import "./AdminDashboard.css";

// const AdminDashboard = ({ user, onLogout }) => {
//   const navigate = useNavigate();

//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [errorUsers, setErrorUsers] = useState("");

//   const [pendingEnrollments, setPendingEnrollments] = useState([]);
//   const [approvedEnrollments, setApprovedEnrollments] = useState([]);
//   const [loadingEnrollments, setLoadingEnrollments] = useState(false);
//   const [loadingApproved, setLoadingApproved] = useState(false);
//   const [errorEnrollments, setErrorEnrollments] = useState("");
//   const [errorApproved, setErrorApproved] = useState("");
//   const [activeTab, setActiveTab] = useState("pending");

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

//   const fetchPendingUsers = useCallback(async () => {
//     setLoadingUsers(true);
//     setErrorUsers("");
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${API_BASE_URL}/api/v1/users/pending`, {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });
//       setPendingUsers(response.data);
//     } catch (err) {
//       handleError(err, setErrorUsers);
//     } finally {
//       setLoadingUsers(false);
//     }
//   }, [handleError]);

//   const fetchPendingEnrollments = useCallback(async () => {
//     setLoadingEnrollments(true);
//     setErrorEnrollments("");
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${API_BASE_URL}/api/v1/enrollments/pending`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       setPendingEnrollments(response.data);
//     } catch (err) {
//       handleError(err, setErrorEnrollments);
//     } finally {
//       setLoadingEnrollments(false);
//     }
//   }, [handleError]);

//   const fetchApprovedEnrollments = useCallback(async () => {
//     setLoadingApproved(true);
//     setErrorApproved("");
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${API_BASE_URL}/api/v1/enrollments/approved`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       setApprovedEnrollments(response.data);
//     } catch (err) {
//       handleError(err, setErrorApproved);
//     } finally {
//       setLoadingApproved(false);
//     }
//   }, [handleError]);

//   const handleApproveUser = async (userId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `${API_BASE_URL}/api/v1/users/approve/${userId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       toast.success("User approved");
//       fetchPendingUsers();
//     } catch (err) {
//       handleError(err, setErrorUsers);
//     }
//   };

//   const handleRejectUser = async (userId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `${API_BASE_URL}/api/v1/users/reject/${userId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       toast.success("User rejected");
//       fetchPendingUsers();
//     } catch (err) {
//       handleError(err, setErrorUsers);
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this user?"
//     );
//     if (!confirmed) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${API_BASE_URL}/api/v1/users/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });
//       toast.success("User deleted");
//       fetchPendingUsers();
//     } catch (err) {
//       handleError(err, setErrorUsers);
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
//       handleError(err, setErrorEnrollments);
//     }
//   };

//   useEffect(() => {
//     if (user?.role === "admin") {
//       fetchPendingUsers();
//       fetchPendingEnrollments();
//       fetchApprovedEnrollments();
//     }
//   }, [
//     user,
//     fetchPendingUsers,
//     fetchPendingEnrollments,
//     fetchApprovedEnrollments,
//   ]);

//   if (!user || user.role !== "admin") {
//     return <div className="unauthorized">Unauthorized</div>;
//   }

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-card">
//         <h2>Admin Dashboard</h2>
//         <button onClick={onLogout} className="btn-secondary logout-btn">
//           Logout
//         </button>

//         {/* Section 1: Pending Users */}
//         <h3>Pending User Approvals</h3>
//         {errorUsers && <p className="error">{errorUsers}</p>}
//         {loadingUsers ? (
//           <p>Loading users...</p>
//         ) : pendingUsers.length === 0 ? (
//           <p>No pending users</p>
//         ) : (
//           <table className="user-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Role</th>
//                 <th>Subject</th>
//                 <th>Created At</th>
//                 <th>Last Login</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pendingUsers.map((pu) => (
//                 <tr key={pu.id}>
//                   <td>{pu.name}</td>
//                   <td>{pu.email}</td>
//                   <td>{pu.role}</td>
//                   <td>{pu.subject || "N/A"}</td>
//                   <td>{new Date(pu.createdAt).toLocaleString()}</td>
//                   <td>
//                     {pu.lastLogin
//                       ? new Date(pu.lastLogin).toLocaleString()
//                       : "Never"}
//                   </td>
//                   <td>
//                     <button
//                       onClick={() => handleApproveUser(pu.id)}
//                       className="btn-primary"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => handleRejectUser(pu.id)}
//                       className="btn-warning"
//                     >
//                       Reject
//                     </button>
//                     {user?.role === "admin" && (
//                       <button
//                         onClick={() => handleDeleteUser(pu.id)}
//                         className="btn-danger"
//                       >
//                         Delete
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}

//         {/* Section 2: Course Enrollments */}
//         <h3>Course Enrollments</h3>
//         <div className="tab-buttons">
//           <button
//             className={activeTab === "pending" ? "tab active" : "tab"}
//             onClick={() => setActiveTab("pending")}
//           >
//             Pending
//           </button>
//           <button
//             className={activeTab === "approved" ? "tab active" : "tab"}
//             onClick={() => setActiveTab("approved")}
//           >
//             Approved
//           </button>
//         </div>

//         {activeTab === "pending" ? (
//           <>
//             {errorEnrollments && <p className="error">{errorEnrollments}</p>}
//             {loadingEnrollments ? (
//               <p>Loading pending enrollments...</p>
//             ) : pendingEnrollments.length === 0 ? (
//               <p>No pending enrollments</p>
//             ) : (
//               <table className="user-table">
//                 <thead>
//                   <tr>
//                     <th>Student</th>
//                     <th>Email</th>
//                     <th>Course</th>
//                     <th>Access Requested</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {pendingEnrollments.map((enroll) => (
//                     <tr key={`${enroll.userId}-${enroll.courseId}`}>
//                       <td>{enroll.user?.name}</td>
//                       <td>{enroll.user?.email}</td>
//                       <td>{enroll.course?.title}</td>
//                       <td>
//                         {new Date(enroll.accessGrantedAt).toLocaleString()}
//                       </td>
//                       <td>
//                         <button
//                           onClick={() =>
//                             handleApproveEnrollment(
//                               enroll.userId,
//                               enroll.courseId
//                             )
//                           }
//                           className="btn-primary"
//                         >
//                           Approve
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </>
//         ) : (
//           <>
//             {errorApproved && <p className="error">{errorApproved}</p>}
//             {loadingApproved ? (
//               <p>Loading approved enrollments...</p>
//             ) : approvedEnrollments.length === 0 ? (
//               <p>No approved enrollments</p>
//             ) : (
//               <table className="user-table">
//                 <thead>
//                   <tr>
//                     <th>Student</th>
//                     <th>Email</th>
//                     <th>Course</th>
//                     <th>Access Granted At</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {approvedEnrollments.map((enroll) => (
//                     <tr key={`${enroll.userId}-${enroll.courseId}`}>
//                       <td>{enroll.user?.name}</td>
//                       <td>{enroll.user?.email}</td>
//                       <td>{enroll.course?.title}</td>
//                       <td>
//                         {new Date(enroll.accessGrantedAt).toLocaleString()}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";
import "./AdminDashboard.css"; // Create this CSS file for styling

const AdminDashboard = ({ user, onLogout }) => {
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingEnrollments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/enrollments/pending`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPendingEnrollments(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching pending enrollments:", err);
        setError("Failed to fetch pending enrollments");
        setLoading(false);
        toast.error("Failed to load pending enrollments");
      }
    };

    if (user && ["teacher", "admin"].includes(user.role)) {
      fetchPendingEnrollments();
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleApprove = async (userId, courseId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/enrollments/approve`,
        { userId, courseId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPendingEnrollments(
        pendingEnrollments.filter(
          (enrollment) =>
            !(enrollment.userId === userId && enrollment.courseId === courseId)
        )
      );
      toast.success("Enrollment approved successfully");
    } catch (err) {
      console.error("Error approving enrollment:", err);
      toast.error("Failed to approve enrollment");
    }
  };

  const handleReject = async (userId, courseId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/v1/enrollments/${userId}/${courseId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPendingEnrollments(
        pendingEnrollments.filter(
          (enrollment) =>
            !(enrollment.userId === userId && enrollment.courseId === courseId)
        )
      );
      toast.success("Enrollment rejected successfully");
    } catch (err) {
      console.error("Error rejecting enrollment:", err);
      toast.error("Failed to reject enrollment");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
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
      {user.role === "teacher" && (
        <div className="enrollments-section">
          <h3>Pending Enrollments</h3>
          {pendingEnrollments.length === 0 ? (
            <p>No pending enrollments.</p>
          ) : (
            <ul className="enrollment-list">
              {pendingEnrollments.map((enrollment) => (
                <li
                  key={`${enrollment.userId}-${enrollment.courseId}`}
                  className="enrollment-item"
                >
                  <p>
                    Student: {enrollment.user.name} ({enrollment.user.email})
                  </p>
                  <p>Course: {enrollment.course.title}</p>
                  <div className="enrollment-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        handleApprove(enrollment.userId, enrollment.courseId)
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        handleReject(enrollment.userId, enrollment.courseId)
                      }
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {onLogout && (
        <button onClick={onLogout} className="btn btn-secondary logout-button">
          Logout
        </button>
      )}
    </div>
  );
};

export default AdminDashboard;
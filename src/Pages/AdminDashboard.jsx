
// import React, { useState, useEffect, useCallback, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { API_BASE_URL } from "../config";
// import { AuthContext } from "../context/AuthContext";
// import "./AdminDashboard.css";

// const AdminDashboard = () => {
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [pendingEnrollments, setPendingEnrollments] = useState([]);
//   const [approvedEnrollments, setApprovedEnrollments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchPendingUsers = useCallback(async () => {
//     try {
//       const res = await fetch("/api/v1/admin/pending-users");
//       const data = await res.json();
//       setPendingUsers(data);
//     } catch (err) {
//       console.error("Error fetching pending users:", err);
//     }
//   }, []);

//   const fetchPendingEnrollments = useCallback(async () => {
//     try {
//       const res = await fetch("/api/v1/admin/enrollments/pending");
//       const data = await res.json();
//       setPendingEnrollments(data);
//     } catch (err) {
//       console.error("Error fetching pending enrollments:", err);
//     }
//   }, []);

//   const fetchApprovedEnrollments = useCallback(async () => {
//     try {
//       const res = await fetch("/api/v1/admin/enrollments/approved");
//       const data = await res.json();
//       setApprovedEnrollments(data);
//     } catch (err) {
//       console.error("Error fetching approved enrollments:", err);
//     }
//   }, []);

//   useEffect(() => {
//     fetchPendingUsers();
//   }, [fetchPendingUsers]);

//   useEffect(() => {
//     fetchPendingEnrollments();
//     fetchApprovedEnrollments();
//   }, [fetchPendingEnrollments, fetchApprovedEnrollments]);

//   useEffect(() => {
//     if (
//       pendingUsers.length &&
//       pendingEnrollments.length &&
//       approvedEnrollments.length
//     ) {
//       setLoading(false);
//     }
//   }, [pendingUsers, pendingEnrollments, approvedEnrollments]);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="admin-dashboard">
//       <h1>Admin Dashboard</h1>

//       <section>
//         <h2>Pending Users</h2>
//         {pendingUsers.map((user) => (
//           <div key={user.id}>{user.email}</div>
//         ))}
//       </section>

//       <section>
//         <h2>Pending Enrollments</h2>
//         {pendingEnrollments.map((enroll) => (
//           <div key={enroll.id}>{enroll.courseTitle}</div>
//         ))}
//       </section>

//       <section>
//         <h2>Approved Enrollments</h2>
//         {approvedEnrollments.map((enroll) => (
//           <div key={enroll.id}>{enroll.courseTitle}</div>
//         ))}
//       </section>
//     </div>
//   );
// };

// export default AdminDashboard;



import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = ({ onLogout }) => {
  const { user } = useContext(AuthContext);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);

  const fetchPendingUsers = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/admin/pending-users");
      setPendingUsers(res.data);
    } catch (err) {
      console.error("Error fetching pending users:", err);
    }
  }, []);

  const fetchPendingEnrollments = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/admin/enrollments/pending");
      setPendingEnrollments(res.data);
    } catch (err) {
      console.error("Error fetching pending enrollments:", err);
    }
  }, []);

  const fetchApprovedEnrollments = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/admin/enrollments/approved");
      setApprovedEnrollments(res.data);
    } catch (err) {
      console.error("Error fetching approved enrollments:", err);
    }
  }, []);

  const handleApproveUser = async (userId) => {
    try {
      await axios.post(`/api/v1/admin/approve-user/${userId}`);
      toast.success("User approved");
      fetchPendingUsers();
    } catch (err) {
      toast.error("Error approving user");
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      await axios.post(`/api/v1/admin/reject-user/${userId}`);
      toast.info("User rejected");
      fetchPendingUsers();
    } catch (err) {
      toast.error("Error rejecting user");
    }
  };

  const handleApproveEnrollment = async (enrollmentId) => {
    try {
      await axios.post(`/api/v1/admin/enrollments/approve/${enrollmentId}`);
      toast.success("Enrollment approved");
      fetchPendingEnrollments();
      fetchApprovedEnrollments();
    } catch (err) {
      toast.error("Error approving enrollment");
    }
  };

  const handleRejectEnrollment = async (enrollmentId) => {
    try {
      await axios.post(`/api/v1/admin/enrollments/reject/${enrollmentId}`);
      toast.info("Enrollment rejected");
      fetchPendingEnrollments();
    } catch (err) {
      toast.error("Error rejecting enrollment");
    }
  };

  useEffect(() => {
    fetchPendingUsers();
    fetchPendingEnrollments();
    fetchApprovedEnrollments();
  }, [fetchPendingUsers, fetchPendingEnrollments, fetchApprovedEnrollments]);

  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "teacher") {
      toast.error("Unauthorized access");
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user || (user.role !== "admin" && user.role !== "teacher")) {
    return <div className="unauthorized">Access Denied</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>

        <div className="admin-tabs">
          <button
            onClick={() => setActiveTab("users")}
            className={activeTab === "users" ? "tab-active" : ""}
          >
            Pending Users
          </button>
          <button
            onClick={() => setActiveTab("pendingEnr")}
            className={activeTab === "pendingEnr" ? "tab-active" : ""}
          >
            Pending Enrollments
          </button>
          <button
            onClick={() => setActiveTab("approvedEnr")}
            className={activeTab === "approvedEnr" ? "tab-active" : ""}
          >
            Approved Enrollments
          </button>
        </div>

        {activeTab === "users" && (
          <section>
            <h2>Pending Users</h2>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="btn-approve"
                        onClick={() => handleApproveUser(user.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleRejectUser(user.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === "pendingEnr" && (
          <section>
            <h2>Pending Enrollments</h2>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingEnrollments.map((enroll) => (
                  <tr key={enroll.id}>
                    <td>{enroll.studentEmail}</td>
                    <td>{enroll.courseTitle}</td>
                    <td>
                      <button
                        className="btn-approve"
                        onClick={() => handleApproveEnrollment(enroll.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleRejectEnrollment(enroll.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === "approvedEnr" && (
          <section>
            <h2>Approved Enrollments</h2>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                </tr>
              </thead>
              <tbody>
                {approvedEnrollments.map((enroll) => (
                  <tr key={enroll.id}>
                    <td>{enroll.studentEmail}</td>
                    <td>{enroll.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

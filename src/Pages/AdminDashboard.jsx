
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";
import "./AdminDashboard.css";

const AdminDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [loadingApproved, setLoadingApproved] = useState(false);

  const [errorUsers, setErrorUsers] = useState("");
  const [errorEnrollments, setErrorEnrollments] = useState("");
  const [errorApproved, setErrorApproved] = useState("");

  const [activeTab, setActiveTab] = useState("pending");

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

  const fetchPendingUsers = useCallback(async () => {
    setLoadingUsers(true);
    setErrorUsers("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/v1/users/pending`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setPendingUsers(res.data);
    } catch (err) {
      handleError(err, setErrorUsers);
    } finally {
      setLoadingUsers(false);
    }
  }, [handleError]);

  const fetchPendingEnrollments = useCallback(async () => {
    setLoadingEnrollments(true);
    setErrorEnrollments("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/enrollments/pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setPendingEnrollments(res.data);
    } catch (err) {
      handleError(err, setErrorEnrollments);
    } finally {
      setLoadingEnrollments(false);
    }
  }, [handleError]);

  const fetchApprovedEnrollments = useCallback(async () => {
    setLoadingApproved(true);
    setErrorApproved("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/enrollments/approved`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setApprovedEnrollments(res.data);
    } catch (err) {
      handleError(err, setErrorApproved);
    } finally {
      setLoadingApproved(false);
    }
  }, [handleError]);

  const handleApproveUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/v1/users/approve/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("User approved");
      fetchPendingUsers();
    } catch (err) {
      handleError(err, setErrorUsers);
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/v1/users/reject/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("User rejected");
      fetchPendingUsers();
    } catch (err) {
      handleError(err, setErrorUsers);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/v1/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success("User deleted");
      fetchPendingUsers();
    } catch (err) {
      handleError(err, setErrorUsers);
    }
  };

  const handleApproveEnrollment = async (userId, courseId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/v1/enrollments/approve`,
        {
          userId,
          courseId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("Enrollment approved");
      fetchPendingEnrollments();
      fetchApprovedEnrollments();
    } catch (err) {
      handleError(err, setErrorEnrollments);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Load content based on role
    if (user.role === "admin") {
      fetchPendingUsers();
    }

    if (["admin", "teacher"].includes(user.role)) {
      fetchPendingEnrollments();
      fetchApprovedEnrollments();
    }
  }, [
    user,
    fetchPendingUsers,
    fetchPendingEnrollments,
    fetchApprovedEnrollments,
  ]);

  if (!user || (user.role !== "admin" && user.role !== "teacher")) {
    return <div className="unauthorized">Unauthorized</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>
          {user.role === "admin" ? "Admin Dashboard" : "Teacher Dashboard"}
        </h2>
        <button onClick={onLogout} className="btn-secondary logout-btn">
          Logout
        </button>

        {/* Admin Only: Pending User Approvals */}
        {user.role === "admin" && (
          <>
            <h3>Pending User Approvals</h3>
            {errorUsers && <p className="error">{errorUsers}</p>}
            {loadingUsers ? (
              <p>Loading users...</p>
            ) : pendingUsers.length === 0 ? (
              <p>No pending users</p>
            ) : (
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Subject</th>
                    <th>Created At</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((pu) => (
                    <tr key={pu.id}>
                      <td>{pu.name}</td>
                      <td>{pu.email}</td>
                      <td>{pu.role}</td>
                      <td>{pu.subject || "N/A"}</td>
                      <td>{new Date(pu.createdAt).toLocaleString()}</td>
                      <td>
                        {pu.lastLogin
                          ? new Date(pu.lastLogin).toLocaleString()
                          : "Never"}
                      </td>
                      <td>
                        <button
                          onClick={() => handleApproveUser(pu.id)}
                          className="btn-primary"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectUser(pu.id)}
                          className="btn-warning"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleDeleteUser(pu.id)}
                          className="btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* Course Enrollments */}
        <h3>Course Enrollments</h3>
        <div className="tab-buttons">
          <button
            className={activeTab === "pending" ? "tab active" : "tab"}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={activeTab === "approved" ? "tab active" : "tab"}
            onClick={() => setActiveTab("approved")}
          >
            Approved
          </button>
        </div>

        {activeTab === "pending" ? (
          <>
            {errorEnrollments && <p className="error">{errorEnrollments}</p>}
            {loadingEnrollments ? (
              <p>Loading pending enrollments...</p>
            ) : pendingEnrollments.length === 0 ? (
              <p>No pending enrollments</p>
            ) : (
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Requested At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingEnrollments.map((enroll) => (
                    <tr key={`${enroll.userId}-${enroll.courseId}`}>
                      <td>{enroll.user?.name}</td>
                      <td>{enroll.user?.email}</td>
                      <td>{enroll.course?.title}</td>
                      <td>
                        {new Date(enroll.accessGrantedAt).toLocaleString()}
                      </td>
                      <td>
                        <button
                          className="btn-primary"
                          onClick={() =>
                            handleApproveEnrollment(
                              enroll.userId,
                              enroll.courseId
                            )
                          }
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        ) : (
          <>
            {errorApproved && <p className="error">{errorApproved}</p>}
            {loadingApproved ? (
              <p>Loading approved enrollments...</p>
            ) : approvedEnrollments.length === 0 ? (
              <p>No approved enrollments</p>
            ) : (
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Access Granted</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedEnrollments.map((enroll) => (
                    <tr key={`${enroll.userId}-${enroll.courseId}`}>
                      <td>{enroll.user?.name}</td>
                      <td>{enroll.user?.email}</td>
                      <td>{enroll.course?.title}</td>
                      <td>
                        {new Date(enroll.accessGrantedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

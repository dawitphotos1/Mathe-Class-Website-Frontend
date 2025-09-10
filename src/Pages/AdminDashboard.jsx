import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance"; // ✅ centralized axios
import "./AdminDashboard.css";

const AdminDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  // Users
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState("");

  // Enrollments
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [loadingApproved, setLoadingApproved] = useState(false);
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
        toast.error(err.response?.data?.error || "Something went wrong");
        setError(err.response?.data?.error || "Something went wrong");
      }
    },
    [navigate, onLogout]
  );

  // ✅ Fetch pending users
  const fetchPendingUsers = useCallback(async () => {
    setLoadingUsers(true);
    setErrorUsers("");
    try {
      const res = await axiosInstance.get("/admin/pending-users");
      setPendingUsers(res.data);
    } catch (err) {
      handleError(err, setErrorUsers);
    } finally {
      setLoadingUsers(false);
    }
  }, [handleError]);

  // ✅ Fetch pending enrollments
  const fetchPendingEnrollments = useCallback(async () => {
    setLoadingEnrollments(true);
    setErrorEnrollments("");
    try {
      const res = await axiosInstance.get("/admin/enrollments?status=pending");
      setPendingEnrollments(res.data.enrollments);
    } catch (err) {
      handleError(err, setErrorEnrollments);
    } finally {
      setLoadingEnrollments(false);
    }
  }, [handleError]);

  // ✅ Fetch approved enrollments
  const fetchApprovedEnrollments = useCallback(async () => {
    setLoadingApproved(true);
    setErrorApproved("");
    try {
      const res = await axiosInstance.get("/admin/enrollments?status=approved");
      setApprovedEnrollments(res.data.enrollments);
    } catch (err) {
      handleError(err, setErrorApproved);
    } finally {
      setLoadingApproved(false);
    }
  }, [handleError]);

  // ✅ Approve user
  const handleApproveUser = async (userId) => {
    try {
      await axiosInstance.patch(`/admin/approve/${userId}`);
      toast.success("User approved");
      fetchPendingUsers();
    } catch (err) {
      handleError(err, setErrorUsers);
    }
  };

  // ✅ Reject user
  const handleRejectUser = async (userId) => {
    try {
      await axiosInstance.patch(`/admin/reject/${userId}`);
      toast.success("User rejected");
      fetchPendingUsers();
    } catch (err) {
      handleError(err, setErrorUsers);
    }
  };

  // ✅ Approve enrollment
  const handleApproveEnrollment = async (enrollmentId) => {
    try {
      await axiosInstance.put(`/admin/enrollments/${enrollmentId}/approve`);
      toast.success("Enrollment approved");
      fetchPendingEnrollments();
      fetchApprovedEnrollments();
    } catch (err) {
      handleError(err, setErrorEnrollments);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchPendingUsers();
      fetchPendingEnrollments();
      fetchApprovedEnrollments();
    }
  }, [
    user,
    fetchPendingUsers,
    fetchPendingEnrollments,
    fetchApprovedEnrollments,
  ]);

  if (!user || user.role !== "admin") {
    return <div className="unauthorized">Unauthorized</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Admin Dashboard</h2>
        <button onClick={onLogout} className="btn-secondary logout-btn">
          Logout
        </button>

        {/* Section 1: Pending Users */}
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
                  <td>
                    <button
                      onClick={() => handleApproveUser(pu.id)}
                      className="btn-primary"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectUser(pu.id)}
                      className="btn-danger"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Section 2: Enrollment Tabs */}
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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingEnrollments.map((enroll) => (
                    <tr key={enroll.id}>
                      <td>{enroll.student?.name}</td>
                      <td>{enroll.student?.email}</td>
                      <td>{enroll.course?.title}</td>
                      <td>
                        <button
                          onClick={() => handleApproveEnrollment(enroll.id)}
                          className="btn-primary"
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
                  </tr>
                </thead>
                <tbody>
                  {approvedEnrollments.map((enroll) => (
                    <tr key={enroll.id}>
                      <td>{enroll.student?.name}</td>
                      <td>{enroll.student?.email}</td>
                      <td>{enroll.course?.title}</td>
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

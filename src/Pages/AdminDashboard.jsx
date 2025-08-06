// AdminDashboard.jsx

import React, { useState, useEffect, useCallback, useContext, useMemo } from "react";
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
  const [activeTab, setActiveTab] = useState("pendingUsers");
  const [darkMode, setDarkMode] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const handleError = useCallback((err) => {
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
  }, [navigate, onLogout]);

  const fetchData = useCallback(async () => {
    const headers = getAuthHeaders();
    try {
      const [pendingUsersRes, approvedUsersRes, pendingEnrollmentsRes, approvedEnrollmentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/admin/pending-users`, { headers }),
        axios.get(`${API_BASE_URL}/api/v1/users/approved`, { headers }),
        axios.get(`${API_BASE_URL}/api/v1/admin/enrollments/pending`, { headers }),
        axios.get(`${API_BASE_URL}/api/v1/admin/enrollments/approved`, { headers }),
      ]);

      setPendingUsers(pendingUsersRes.data || []);
      setApprovedUsers(approvedUsersRes.data || []);
      setPendingEnrollments(pendingEnrollmentsRes.data?.enrollments || []);
      setApprovedEnrollments(approvedEnrollmentsRes.data?.enrollments || []);
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApproveUser = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/v1/admin/approve-user/${id}`, {}, { headers: getAuthHeaders() });
      toast.success("User approved");
      fetchData();
    } catch (err) {
      handleError(err);
    }
  };

  const handleRejectUser = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/v1/admin/reject-user/${id}`, {}, { headers: getAuthHeaders() });
      toast.info("User rejected and deleted");
      fetchData();
    } catch (err) {
      handleError(err);
    }
  };

  const handleApproveEnrollment = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/api/v1/admin/enrollments/${id}/approve`, {}, { headers: getAuthHeaders() });
      toast.success("Enrollment approved");
      fetchData();
    } catch (err) {
      handleError(err);
    }
  };

  const handleRejectEnrollment = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/admin/enrollments/${id}`, { headers: getAuthHeaders() });
      toast.info("Enrollment rejected");
      fetchData();
    } catch (err) {
      handleError(err);
    }
  };

  const filtered = (arr) => (arr || []);

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <div>
          <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? "☀️ Light" : "🌙 Dark"}</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">👨‍🎓 Total Students<br />{approvedUsers.length}</div>
        <div className="summary-card">🕒 Pending Users<br />{pendingUsers.length}</div>
        <div className="summary-card">📥 Pending Enrollments<br />{pendingEnrollments.length}</div>
        <div className="summary-card">✅ Approved Enrollments<br />{approvedEnrollments.length}</div>
      </div>

      <div className="admin-tabs">
        <button onClick={() => setActiveTab("pendingUsers")} className={activeTab === "pendingUsers" ? "tab-active" : ""}>👤 Pending Users</button>
        <button onClick={() => setActiveTab("approvedUsers")} className={activeTab === "approvedUsers" ? "tab-active" : ""}>✅ Approved Users</button>
        <button onClick={() => setActiveTab("pendingEnrollments")} className={activeTab === "pendingEnrollments" ? "tab-active" : ""}>📥 Pending Enrollments</button>
        <button onClick={() => setActiveTab("approvedEnrollments")} className={activeTab === "approvedEnrollments" ? "tab-active" : ""}>📘 Approved Enrollments</button>
      </div>

      {activeTab === "pendingUsers" && (
        <div>
          <h3>Pending Users</h3>
          <table className="user-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {pendingUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <button onClick={() => handleApproveUser(u.id)}>✅ Approve</button>
                    <button onClick={() => handleRejectUser(u.id)}>❌ Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "approvedUsers" && (
        <div>
          <h3>Approved Users</h3>
          <table className="user-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>
              {approvedUsers.map((u) => (
                <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "pendingEnrollments" && (
        <div>
          <h3>Pending Enrollments</h3>
          <table className="user-table">
            <thead><tr><th>Name</th><th>Course</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered(pendingEnrollments).map((e) => (
                <tr key={e.id}>
                  <td>{e.User?.name}</td>
                  <td>{e.Course?.title}</td>
                  <td>
                    <button onClick={() => handleApproveEnrollment(e.id)}>✅ Approve</button>
                    <button onClick={() => handleRejectEnrollment(e.id)}>❌ Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "approvedEnrollments" && (
        <div>
          <h3>Approved Enrollments</h3>
          <table className="user-table">
            <thead><tr><th>Name</th><th>Course</th></tr></thead>
            <tbody>
              {filtered(approvedEnrollments).map((e) => (
                <tr key={e.id}><td>{e.User?.name}</td><td>{e.Course?.title}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

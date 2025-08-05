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
  const [studentFilter, setStudentFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

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
    if (!user || !user.role) return;
    const headers = getAuthHeaders();

    try {
      if (user.role === "admin") {
        const [pendingUsersRes, approvedUsersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/v1/admin/pending-users`, { headers }),
          axios.get(`${API_BASE_URL}/api/v1/users/approved`, { headers }),
        ]);
        setPendingUsers(pendingUsersRes.data || []);
        setApprovedUsers(approvedUsersRes.data || []);
      }

      if (["admin", "teacher"].includes(user.role)) {
        const [pendingEnrollmentsRes, approvedEnrollmentsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/v1/admin/enrollments/pending`, { headers }),
          axios.get(`${API_BASE_URL}/api/v1/admin/enrollments/approved`, { headers }),
        ]);
        setPendingEnrollments(pendingEnrollmentsRes.data || []);
        setApprovedEnrollments(approvedEnrollmentsRes.data || []);
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
      await axios.put(`${API_BASE_URL}/api/v1/admin/enrollments/${id}/approve`, {}, {
        headers: getAuthHeaders()
      });
      toast.success("Enrollment approved");
      fetchData();
    } catch (err) {
      handleError(err);
    }
  };

  const handleRejectEnrollment = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/admin/enrollments/${id}`, {
        headers: getAuthHeaders()
      });
      toast.info("Enrollment rejected");
      fetchData();
    } catch (err) {
      handleError(err);
    }
  };

  const handleApproveUser = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/v1/admin/approve-user/${id}`, {}, {
        headers: getAuthHeaders()
      });
      toast.success("User approved");
      fetchData();
    } catch (err) {
      handleError(err);
    }
  };

  const handleRejectUser = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/v1/admin/reject-user/${id}`, {}, {
        headers: getAuthHeaders()
      });
      toast.info("User rejected and deleted");
      fetchData();
    } catch (err) {
      handleError(err);
    }
  };

  const downloadCSV = (csvString, filename) => {
    const uri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvString);
    const link = document.createElement("a");
    link.setAttribute("href", uri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportUsersToCSV = (users, filename) => {
    const headers = ["Name", "Email", "Role", "Approved"];
    const csv = [
      headers.join(","),
      ...users.map((u) =>
        [u.name, u.email, u.role, u.approved ? "Yes" : "No"]
          .map((v) => `"${v}"`)
          .join(",")
      ),
    ].join("\n");
    downloadCSV(csv, filename);
  };

  const filteredApprovedUsers = approvedUsers.filter(
    (u) => !roleFilter || u.role === roleFilter
  );

  const paginatedUsers = filteredApprovedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const allCourses = useMemo(() => {
    const titles = [...pendingEnrollments, ...approvedEnrollments]
      .map((e) => e.Course?.title)
      .filter(Boolean);
    return Array.from(new Set(titles)).sort();
  }, [pendingEnrollments, approvedEnrollments]);

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h2>{user?.role === "admin" ? "Admin Dashboard" : "Teacher Dashboard"}</h2>
          <div className="header-actions">
            <button onClick={() => setDarkMode(!darkMode)} className="btn-secondary">
              {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>
            <button onClick={onLogout} className="btn-secondary logout-btn">Logout</button>
          </div>
        </div>

        <div className="summary-cards">
          {user?.role === "admin" && (
            <>
              <div className="summary-card">👩🎓 Total Students<br />{approvedUsers.length}</div>
              <div className="summary-card">🕒 Pending Users<br />{pendingUsers.length}</div>
            </>
          )}
          <div className="summary-card">📥 Pending Enrollments<br />{pendingEnrollments.length}</div>
          <div className="summary-card">✅ Approved Enrollments<br />{approvedEnrollments.length}</div>
        </div>

        <div className="admin-tabs">
          {user?.role === "admin" && (
            <>
              <button className={`tab-button ${activeTab === "pendingUsers" ? "tab-active" : ""}`} onClick={() => setActiveTab("pendingUsers")}>👤 Pending Users</button>
              <button className={`tab-button ${activeTab === "approvedUsers" ? "tab-active" : ""}`} onClick={() => setActiveTab("approvedUsers")}>👨🎓 Total Students</button>
            </>
          )}
          <button className={`tab-button ${activeTab === "pendingEnrollments" ? "tab-active" : ""}`} onClick={() => setActiveTab("pendingEnrollments")}>📥 Pending Enrollments</button>
          <button className={`tab-button ${activeTab === "approvedEnrollments" ? "tab-active" : ""}`} onClick={() => setActiveTab("approvedEnrollments")}>✅ Approved Enrollments</button>
        </div>

        {activeTab === "pendingUsers" && (
          <>
            <h3>Pending Users</h3>
            <button onClick={() => exportUsersToCSV(pendingUsers, "pending_users.csv")} className="btn-secondary">📤 Export</button>
            <table className="user-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td><td>{user.email}</td><td>{user.role}</td>
                    <td>
                      <button className="btn-primary" onClick={() => handleApproveUser(user.id)}>✅ Approve</button>
                      <button className="btn-action btn-reject" onClick={() => handleRejectUser(user.id)}>❌ Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "approvedUsers" && (
          <>
            <h3>Approved Users</h3>
            <div className="dashboard-actions">
              <button onClick={() => exportUsersToCSV(filteredApprovedUsers, "approved_users.csv")} className="btn-secondary">📤 Export</button>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <table className="user-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th></tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td><td>{user.email}</td><td>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
              <span>Page {currentPage}</span>
              <button onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage >= Math.ceil(filteredApprovedUsers.length / usersPerPage)}>Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

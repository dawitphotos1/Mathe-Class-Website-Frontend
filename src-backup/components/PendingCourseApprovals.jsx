//components/PendingCourseApprovals.jsx
import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const PendingCourseApprovals = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingEnrollments();
  }, []);

  const fetchPendingEnrollments = async () => {
    try {
      const res = await axios.get("/admin/enrollments?status=pending");
      setEnrollments(res.data.enrollments || []);
    } catch (err) {
      console.error("❌ Failed to load pending enrollments:", err);
      toast.error("Failed to load pending enrollments");
    }
  };

  const handleApprove = async (enrollmentId) => {
    setLoading(true);
    try {
      await axios.patch(`/admin/enrollments/${enrollmentId}/approve`);
      toast.success("🎉 Enrollment approved successfully!");

      // Refresh the list
      fetchPendingEnrollments();
    } catch (err) {
      console.error("❌ Approve failed:", err.response?.data || err.message);

      if (err.code === "ECONNABORTED") {
        toast.error("Backend is waking up... Please try again in a moment.");
      } else {
        toast.error("Approval failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (enrollmentId) => {
    setLoading(true);
    try {
      await axios.patch(`/admin/enrollments/${enrollmentId}/reject`);
      toast.success("Enrollment rejected");

      // Refresh the list
      fetchPendingEnrollments();
    } catch (err) {
      console.error("❌ Reject failed:", err.response?.data || err.message);
      toast.error("Rejection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card">
      <h3>📋 Pending Course Enrollments</h3>
      {enrollments.length === 0 ? (
        <p>No pending enrollments 🎉</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Course</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td>{enrollment.student?.name || "N/A"}</td>
                <td>{enrollment.student?.email || "N/A"}</td>
                <td>{enrollment.course?.title || "N/A"}</td>
                <td>
                  <span className={`status-badge ${enrollment.payment_status}`}>
                    {enrollment.payment_status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleApprove(enrollment.id)}
                      disabled={loading}
                      className="btn-success"
                    >
                      {loading ? "Approving..." : "✅ Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(enrollment.id)}
                      disabled={loading}
                      className="btn-danger"
                    >
                      {loading ? "Rejecting..." : "❌ Reject"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingCourseApprovals;
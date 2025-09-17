import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance"; // ✅ use custom instance
import { toast } from "react-toastify";

const PendingCourseApprovals = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/enrollments/pending");
        setEnrollments(res.data.enrollments || []);
      } catch (err) {
        toast.error("Failed to load pending enrollments");
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (userId, courseId) => {
    try {
      await axios.post("/enrollments/approve", { userId, courseId });
      toast.success("Enrollment approved");
      setEnrollments((prev) =>
        prev.filter((e) => !(e.userId === userId && e.courseId === courseId))
      );
    } catch (err) {
      console.error("❌ Approve failed:", err.response?.data || err.message);
      toast.error("Approval failed");
    }
  };

  return (
    <div className="dashboard-card">
      <h3>Pending Course Enrollments</h3>
      {enrollments.length === 0 ? (
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
            {enrollments.map((e, i) => (
              <tr key={i}>
                <td>{e.user?.name}</td>
                <td>{e.user?.email}</td>
                <td>{e.course?.title}</td>
                <td>
                  <button
                    onClick={() => handleApprove(e.userId, e.courseId)}
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
    </div>
  );
};

export default PendingCourseApprovals;

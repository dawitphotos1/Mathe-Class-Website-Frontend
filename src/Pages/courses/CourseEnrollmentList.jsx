// src/Pages/courses/CourseEnrollments.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from '../../utils/axiosInstance'; // Use axiosInstance
import { toast } from "react-toastify";
import "./CourseEnrollmentList.css";

const CourseEnrollmentList = () => {
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      // No need to manually add headers, axiosInstance handles auth & baseURL
      const [pendingRes, approvedRes] = await Promise.all([
        axiosInstance.get("/admin/enrollments/pending"),
        axiosInstance.get("/admin/enrollments/approved"),
      ]);

      setPendingEnrollments(pendingRes.data);
      setApprovedEnrollments(approvedRes.data);
    } catch (err) {
      console.error("Failed to load enrollments:", err);
      toast.error("Failed to fetch course enrollments");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEnrollment = async (userId, courseId) => {
    try {
      await axiosInstance.post("/admin/enrollments/approve", {
        userId,
        courseId,
      });
      toast.success("Enrollment approved");
      fetchEnrollments();
    } catch (err) {
      console.error("Enrollment approval failed:", err);
      toast.error("Failed to approve enrollment");
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <div className="course-enrollment-list">
      {loading ? (
        <p>Loading enrollments...</p>
      ) : (
        <>
          <h3>⏳ Pending Course Enrollments</h3>
          {pendingEnrollments.length === 0 ? (
            <p>No pending enrollments</p>
          ) : (
            pendingEnrollments.map((e, idx) => (
              <div key={idx} className="enrollment-card">
                <p>
                  <strong>{e.user.name}</strong> ({e.user.email}) wants to
                  enroll in <strong>{e.course.title}</strong>
                </p>
                <button
                  className="btn-approve"
                  onClick={() => handleApproveEnrollment(e.userId, e.courseId)}
                >
                  ✅ Approve Enrollment
                </button>
              </div>
            ))
          )}

          <h3>✅ Approved Enrollments</h3>
          {approvedEnrollments.length === 0 ? (
            <p>No approved enrollments</p>
          ) : (
            approvedEnrollments.map((e, idx) => (
              <div key={idx} className="enrollment-card approved">
                <p>
                  <strong>{e.user.name}</strong> ({e.user.email}) enrolled in{" "}
                  <strong>{e.course.title}</strong>
                </p>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default CourseEnrollmentList;

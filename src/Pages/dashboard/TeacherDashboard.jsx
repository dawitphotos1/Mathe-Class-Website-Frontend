import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Use axiosInstance
import { toast } from "react-toastify";
import CreateLessonForm from "../../components/CreateLessonForm";
import { Link } from "react-router-dom";

import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/v1/enrollments/pending");
      setEnrollments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch enrollments", err);
      toast.error("Could not load course enrollments");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, courseId) => {
    try {
      await axiosInstance.post("/api/v1/enrollments/approve", {
        userId,
        courseId,
      });
      toast.success("Enrollment approved");
      fetchEnrollments();
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (userId, courseId) => {
    try {
      await axiosInstance.post("/api/v1/enrollments/reject", {
        userId,
        courseId,
      });
      toast.warn("Enrollment rejected");
      fetchEnrollments();
    } catch {
      toast.error("Failed to reject");
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <div className="teacher-dashboard">
      <h1>Welcome, Teacher 👩🏫</h1>
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/teacher/create-course">
          <button className="btn-create-course">➕ Create New Course</button>
        </Link>
      </div>

      <section className="course-enrollments-section">
        <h2>📚 Pending Course Enrollments</h2>
        {loading ? (
          <p>Loading...</p>
        ) : enrollments.length === 0 ? (
          <p>No pending enrollments</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Course</th>
                <th>Requested</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e) => (
                <tr key={`${e.userId}-${e.courseId}`}>
                  <td>{e.user?.name}</td>
                  <td>{e.user?.email}</td>
                  <td>{e.course?.title}</td>
                  <td>{new Date(e.accessGrantedAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(e.userId, e.courseId)}
                    >
                      ✅ Approve
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleReject(e.userId, e.courseId)}
                    >
                      ❌ Reject
                    </button>
                    <button
                      className="btn-add-lesson"
                      onClick={() => setSelectedCourseId(e.courseId)}
                      title="Add lesson to this course"
                    >
                      ➕ Add Lesson
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {selectedCourseId && (
        <div className="lesson-form-container">
          <h2>📘 Add Lesson to Course #{selectedCourseId}</h2>
          <CreateLessonForm
            courseId={selectedCourseId}
            onLessonCreated={() => {
              setSelectedCourseId(null);
              toast.success("Lesson created");
            }}
          />
          <button onClick={() => setSelectedCourseId(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;

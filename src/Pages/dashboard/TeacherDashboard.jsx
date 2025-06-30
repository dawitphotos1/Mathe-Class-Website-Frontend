
// ✅ TeacherDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";
import CreateLessonForm from "../../components/CreateLessonForm"; 
import { Link } from "react-router-dom";
// import CreateCourse from "../CreateCourse";

import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [selectedCourseId, setSelectedCourseId] = useState(null);
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/enrollments/pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEnrollments(res.data);
    } catch (err) {
      console.error("Failed to fetch enrollments", err);
      toast.error("Could not load course enrollments");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, courseId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/enrollments/approve`,
        { userId, courseId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Enrollment approved");
      fetchEnrollments();
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (userId, courseId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/enrollments/reject`,
        { userId, courseId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
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
      <h1>Welcome, Teacher 👩‍🏫</h1>
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
                    {/* <Link to={`/courses/${courseId}/manage-lessons`}> */}
                    <Link to="/teacher/create-course">
                      <button className="btn-create-course">
                        ➕ Create New Course
                      </button>
                    </Link>

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

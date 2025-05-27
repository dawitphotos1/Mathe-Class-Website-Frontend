// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { API_BASE_URL } from "../../config";
// import CourseCard from "../courses/CourseCard";
// import "../Dashboard.css";
// import "../TeacherDashboard.css";

// const TeacherDashboard = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `${API_BASE_URL}/api/v1/courses?teacherId=${user.id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setCourses(response.data);
//       } catch (err) {
//         console.error("Error fetching courses:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.role === "teacher") {
//       fetchCourses();
//     }
//   }, [user]);

//   const handleDelete = async (courseId) => {
//     if (window.confirm("Permanently delete this course?")) {
//       try {
//         const token = localStorage.getItem("token");
//         await axios.delete(`${API_BASE_URL}/api/v1/courses/${courseId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCourses((prev) => prev.filter((course) => course.id !== courseId));
//       } catch (err) {
//         console.error("Delete error:", err);
//       }
//     }
//   };

//   return (
//     <div className="dashboard">
//       <div className="dashboard-header">
//         <h1>Your Courses</h1>
//         <Link to="/create-course" className="btn btn-primary">
//           Create New Course
//         </Link>
//       </div>

//       <div className="courses-grid">
//         {courses.map((course) => (
//           <CourseCard
//             key={course.id}
//             course={course}
//             user={user}
//             onDelete={handleDelete}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TeacherDashboard;




import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/users/pending`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("Failed to load pending students");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/users/approve/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Student approved");
      fetchPendingStudents(); // Refresh list
    } catch (err) {
      console.error("Approve error:", err);
      toast.error("Failed to approve student");
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/users/reject/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.warn("Student rejected");
      fetchPendingStudents(); // Refresh list
    } catch (err) {
      console.error("Reject error:", err);
      toast.error("Failed to reject student");
    }
  };

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  return (
    <div className="teacher-dashboard">
      <h1>Welcome, Teacher 👩‍🏫</h1>

      <div className="pending-students-section">
        <h2>Pending Student Approvals</h2>
        {loading ? (
          <p>Loading...</p>
        ) : students.length === 0 ? (
          <p>No pending students</p>
        ) : (
          <div className="student-list">
            {students.map((student) => (
              <div key={student.id} className="student-card">
                <div className="student-info">
                  <strong>{student.name}</strong> ({student.email})<br />
                  Subject: {student.subject || "N/A"}
                </div>
                <div className="actions">
                  <button
                    className="btn-approve"
                    onClick={() => handleApprove(student.id)}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleReject(student.id)}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;


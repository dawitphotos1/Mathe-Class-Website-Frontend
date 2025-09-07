import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { useParams } from "react-router-dom";

const TeacherCourseProgress = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/progress/course/${courseId}/students`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudents(res.data.studentProgress);
      } catch (err) {
        console.error("Failed to load student progress", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [courseId]);

  if (loading) return <p>Loading student progress...</p>;

  return (
    <div>
      <h2>📊 Student Progress Overview</h2>
      {students.length === 0 ? (
        <p>No enrolled students found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Progress</th>
              <th>Completed / Total</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.studentId}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.progress}%</td>
                <td>
                  {s.completedCount} / {s.totalLessons}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherCourseProgress;

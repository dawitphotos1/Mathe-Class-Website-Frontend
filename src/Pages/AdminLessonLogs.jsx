
// import React, { useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance"; // adjust path as needed

// const AdminLessonLogs = () => {
//   const [logs, setLogs] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchLogs = async () => {
//       try {
//         const res = await axiosInstance.get("/admin/lesson-logs");
//         setLogs(res.data);
//       } catch (err) {
//         console.error(err);
//         setError("❌ Failed to load logs.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLogs();
//   }, []);

//   const handleDownload = () => {
//     // Assuming axiosInstance does not expose token, get it directly
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Please log in to download logs.");
//       return;
//     }
//     window.open(`/api/v1/admin/lesson-logs/download?token=${token}`, "_blank");
//   };

//   return (
//     <div className="admin-log-viewer">
//       <h2>📘 Lesson Audit Logs</h2>
//       <button onClick={handleDownload} className="btn-download">
//         ⬇️ Download Log File
//       </button>

//       {loading && <p>Loading logs...</p>}

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {!loading && !error && (
//         <pre
//           style={{
//             background: "#f7f7f7",
//             padding: "1rem",
//             marginTop: "1rem",
//             whiteSpace: "pre-wrap",
//             maxHeight: "400px",
//             overflowY: "auto",
//             border: "1px solid #ddd",
//             borderRadius: "4px",
//           }}
//         >
//           {logs}
//         </pre>
//       )}
//     </div>
//   );
// };

// export default AdminLessonLogs;




import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";

const AdminLessonLogs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const fetchLogs = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/admin/lesson-logs");
      setLogs(res.data.logs || []);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to load lesson logs.";
      setError(msg);
      toast.error(msg);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const containerClass = `p-6 rounded-lg shadow-md ${
    isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
  }`;

  const tableClass = `min-w-full border text-sm mt-4 ${
    isDark ? "border-gray-700 text-gray-200" : "border-gray-300 text-gray-800"
  }`;

  return (
    <div className={containerClass}>
      <h2 className="text-2xl font-bold mb-4">Lesson Activity Logs</h2>

      {error && <p className="text-red-400">{error}</p>}

      {logs.length === 0 ? (
        <p className="text-gray-400">No lesson logs available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr className={isDark ? "bg-gray-700" : "bg-gray-200"}>
                <th className="px-4 py-2">Teacher</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Lesson Title</th>
                <th className="px-4 py-2">Action</th>
                <th className="px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className={isDark ? "border-gray-700" : "border-gray-300"}
                >
                  <td className="px-4 py-2">{log.teacher?.name || "N/A"}</td>
                  <td className="px-4 py-2">{log.course?.title || "N/A"}</td>
                  <td className="px-4 py-2">{log.lesson_title}</td>
                  <td className="px-4 py-2 capitalize">{log.action}</td>
                  <td className="px-4 py-2">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminLessonLogs;

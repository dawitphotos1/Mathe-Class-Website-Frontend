
import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance"; // adjust path as needed

const AdminLessonLogs = () => {
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axiosInstance.get("/admin/lesson-logs");
        setLogs(res.data);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to load logs.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handleDownload = () => {
    // Assuming axiosInstance does not expose token, get it directly
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to download logs.");
      return;
    }
    window.open(`/api/v1/admin/lesson-logs/download?token=${token}`, "_blank");
  };

  return (
    <div className="admin-log-viewer">
      <h2>📘 Lesson Audit Logs</h2>
      <button onClick={handleDownload} className="btn-download">
        ⬇️ Download Log File
      </button>

      {loading && <p>Loading logs...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <pre
          style={{
            background: "#f7f7f7",
            padding: "1rem",
            marginTop: "1rem",
            whiteSpace: "pre-wrap",
            maxHeight: "400px",
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          {logs}
        </pre>
      )}
    </div>
  );
};

export default AdminLessonLogs;

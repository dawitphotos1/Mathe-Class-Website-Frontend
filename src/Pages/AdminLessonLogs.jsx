import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminLessonLogs = () => {
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/v1/admin/lesson-logs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        setLogs("❌ Failed to load logs.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handleDownload = () => {
    const token = localStorage.getItem("token");
    window.open(`/api/v1/admin/lesson-logs/download?token=${token}`, "_blank");
  };

  return (
    <div className="admin-log-viewer">
      <h2>📘 Lesson Audit Logs</h2>
      <button onClick={handleDownload} className="btn-download">
        ⬇️ Download Log File
      </button>
      <pre
        style={{
          background: "#f7f7f7",
          padding: "1rem",
          marginTop: "1rem",
          whiteSpace: "pre-wrap",
        }}
      >
        {loading ? "Loading..." : logs}
      </pre>
    </div>
  );
};

export default AdminLessonLogs;

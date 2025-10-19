
// // src/components/PendingStudents.jsx

import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

const PendingStudents = () => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const fetchPendingStudents = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/admin/students?status=pending");
      setPendingStudents(res.data.students || []);
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to load pending students.";
      setError(msg);
      toast.error(msg);
    }
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.patch(`/admin/students/${id}/approve`);
      toast.success("✅ Student approved successfully");
      fetchPendingStudents();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to approve student.";
      toast.error(msg);
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.patch(`/admin/students/${id}/reject`);
      toast.info("🚫 Student rejected");
      fetchPendingStudents();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to reject student.";
      toast.error(msg);
    }
  };

  useEffect(() => {
    fetchPendingStudents();
  }, [fetchPendingStudents]);

  const containerClass = `p-6 rounded-lg shadow-md ${
    isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
  }`;

  const tableClass = `min-w-full border text-sm mt-4 ${
    isDark ? "border-gray-700 text-gray-200" : "border-gray-300 text-gray-800"
  }`;

  return (
    <div className={containerClass}>
      <h2 className="text-2xl font-bold mb-4">Pending Student Approvals</h2>

      {error && <p className="text-red-400">{error}</p>}

      {pendingStudents.length === 0 ? (
        <p className="text-gray-400">No pending students found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr className={isDark ? "bg-gray-700" : "bg-gray-200"}>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingStudents.map((s) => (
                <tr
                  key={s.id}
                  className={isDark ? "border-gray-700" : "border-gray-300"}
                >
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 py-2">{s.subject || "N/A"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleApprove(s.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(s.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
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

export default PendingStudents;

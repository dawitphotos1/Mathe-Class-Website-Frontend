
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PendingStudents = () => {
  const { user, isAuthenticated } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingStudents = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/admin/pending-users");
      setStudents(data);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Failed to load pending students";
      toast.error(errorMsg);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await axiosInstance.patch(`/admin/${action}/${id}`);
      toast.success(`Student ${action}ed successfully`);
      fetchPendingStudents();
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || `Failed to ${action} student`;
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchPendingStudents();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Student Approvals</h2>

      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500">No students pending approval.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Subject</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Registered At</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{s.name}</td>
                  <td className="py-2 px-4 border-b">{s.email}</td>
                  <td className="py-2 px-4 border-b">{s.subject || "-"}</td>
                  <td className="py-2 px-4 border-b">{s.approvalStatus}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => handleAction(s.id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleAction(s.id, "reject")}
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
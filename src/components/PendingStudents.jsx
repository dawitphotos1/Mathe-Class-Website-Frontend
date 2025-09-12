
import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { PendingContext } from "../context/PendingContext";

const PendingStudents = () => {
  const { user, token } = useContext(AuthContext);
  const { fetchPendingCount } = useContext(PendingContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all pending students
  const fetchPendingStudents = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        "/api/v1/admin/pending-students",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(data);
    } catch {
      toast.error("Failed to load pending students");
    } finally {
      setLoading(false);
    }
  };

  // Approve or reject student
  const handleAction = async (id, action) => {
    try {
      await axiosInstance.patch(
        `/api/v1/admin/approve-student/${id}`,
        { action }, // pass action in request body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Student ${action}d successfully`);
      fetchPendingStudents();
      fetchPendingCount();
    } catch {
      toast.error(`Failed to ${action} student`);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchPendingStudents();
    }
  }, [user]);

  if (user?.role !== "admin") {
    return (
      <p className="p-6 text-center text-red-600 font-semibold">
        ❌ Access denied: Admins only.
      </p>
    );
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

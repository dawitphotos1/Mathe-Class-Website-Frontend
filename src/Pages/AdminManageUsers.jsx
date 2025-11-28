

// src/Pages/AdminManageUsers.jsx

import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to load users.";
      setError(msg);
      toast.error(msg);
    }
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      toast.success("🗑️ User deleted successfully");
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to delete user.";
      toast.error(msg);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const containerClass = `p-6 rounded-lg shadow-md ${
    isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
  }`;

  const tableClass = `min-w-full border text-sm mt-4 ${
    isDark ? "border-gray-700 text-gray-200" : "border-gray-300 text-gray-800"
  }`;

  return (
    <div className={containerClass}>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      {error && <p className="text-red-400">{error}</p>}

      {users.length === 0 ? (
        <p className="text-gray-400">No users available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr className={isDark ? "bg-gray-700" : "bg-gray-200"}>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className={isDark ? "border-gray-700" : "border-gray-300"}
                >
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 capitalize">{u.role}</td>
                  <td className="px-4 py-2">{u.approval_status}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => toast.info("Edit feature coming soon")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
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

export default AdminManageUsers;

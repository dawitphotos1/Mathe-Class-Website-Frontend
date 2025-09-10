// src/api/adminApi.js
import axiosInstance from "../utils/axiosInstance";

// =========================
// 📊 Dashboard
// =========================
export const getDashboardStats = async () => {
  const res = await axiosInstance.get("/admin/dashboard");
  return res.data;
};

// =========================
// 👤 Users
// =========================
export const getPendingUsers = async () => {
  const res = await axiosInstance.get("/admin/pending-users");
  return res.data;
};

export const getApprovedUsers = async () => {
  const res = await axiosInstance.get("/admin/users?status=approved");
  return res.data;
};

export const getRejectedUsers = async () => {
  const res = await axiosInstance.get("/admin/users?status=rejected");
  return res.data;
};

export const approveUser = async (userId) => {
  const res = await axiosInstance.patch(`/admin/approve/${userId}`);
  return res.data;
};

export const rejectUser = async (userId) => {
  const res = await axiosInstance.patch(`/admin/reject/${userId}`);
  return res.data;
};

// =========================
// 📘 Enrollments
// =========================
export const getEnrollments = async (status = "pending") => {
  const res = await axiosInstance.get(`/admin/enrollments?status=${status}`);
  return res.data.enrollments;
};

export const approveEnrollment = async (enrollmentId) => {
  const res = await axiosInstance.put(
    `/admin/enrollments/${enrollmentId}/approve`
  );
  return res.data;
};

export const rejectEnrollment = async (enrollmentId) => {
  const res = await axiosInstance.delete(
    `/admin/enrollments/${enrollmentId}/reject`
  );
  return res.data;
};

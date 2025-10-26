// // src/api/adminApi.js
// import axiosInstance from "../utils/axiosInstance";

// // =========================
// // 📊 Dashboard
// // =========================
// export const getDashboardStats = async () => {
//   const res = await axiosInstance.get("/admin/dashboard");
//   return res.data;
// };

// // =========================
// // 👤 Users
// // =========================
// export const getPendingUsers = async () => {
//   const res = await axiosInstance.get("/admin/pending-users");
//   return res.data;
// };

// export const getApprovedUsers = async () => {
//   const res = await axiosInstance.get("/admin/users?status=approved");
//   return res.data;
// };

// export const getRejectedUsers = async () => {
//   const res = await axiosInstance.get("/admin/users?status=rejected");
//   return res.data;
// };

// export const approveUser = async (userId) => {
//   const res = await axiosInstance.patch(`/admin/approve/${userId}`);
//   return res.data;
// };

// export const rejectUser = async (userId) => {
//   const res = await axiosInstance.patch(`/admin/reject/${userId}`);
//   return res.data;
// };

// // =========================
// // 📘 Enrollments
// // =========================
// export const getEnrollments = async (status = "pending") => {
//   const res = await axiosInstance.get(`/admin/enrollments?status=${status}`);
//   return res.data.enrollments;
// };

// export const approveEnrollment = async (enrollmentId) => {
//   const res = await axiosInstance.put(
//     `/admin/enrollments/${enrollmentId}/approve`
//   );
//   return res.data;
// };

// export const rejectEnrollment = async (enrollmentId) => {
//   const res = await axiosInstance.delete(
//     `/admin/enrollments/${enrollmentId}/reject`
//   );
//   return res.data;
// };


// src/api/adminApi.js
import axiosInstance from "../utils/axiosInstance";

// =========================
// 👤 Students
// =========================
export const getStudentsByStatus = async (status = "pending") => {
  const res = await axiosInstance.get(`/admin/students?status=${status}`);
  return res.data.students || [];
};

export const approveStudent = async (studentId) => {
  const res = await axiosInstance.patch(`/admin/students/${studentId}/approve`);
  return res.data;
};

export const rejectStudent = async (studentId) => {
  const res = await axiosInstance.patch(`/admin/students/${studentId}/reject`);
  return res.data;
};

// =========================
// 📘 Enrollments
// =========================
export const getEnrollmentsByStatus = async (status = "pending") => {
  const res = await axiosInstance.get(`/admin/enrollments?status=${status}`);
  return res.data.enrollments || [];
};

export const approveEnrollment = async (enrollmentId) => {
  const res = await axiosInstance.patch(
    `/admin/enrollments/${enrollmentId}/approve`
  );
  return res.data;
};

export const rejectEnrollment = async (enrollmentId) => {
  const res = await axiosInstance.patch(
    `/admin/enrollments/${enrollmentId}/reject`
  );
  return res.data;
};

// =========================
// 📊 Dashboard Stats
// =========================
export const getDashboardStats = async () => {
  try {
    const [pendingStudents, pendingEnrollments] = await Promise.all([
      getStudentsByStatus("pending"),
      getEnrollmentsByStatus("pending"),
    ]);

    return {
      pendingStudents: pendingStudents.length,
      pendingEnrollments: pendingEnrollments.length,
      totalPending: pendingStudents.length + pendingEnrollments.length,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { pendingStudents: 0, pendingEnrollments: 0, totalPending: 0 };
  }
};
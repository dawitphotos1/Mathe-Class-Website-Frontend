
// // src/Pages/AdminDashboard.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import { toast } from "react-toastify";
// import axiosInstance from "../utils/axiosInstance";
// import { useAuth } from "../context/AuthContext";
// import "./AdminDashboard.css";

// const AdminDashboard = () => {
//   const { user } = useAuth();

//   const [pendingStudents, setPendingStudents] = useState([]);
//   const [approvedStudents, setApprovedStudents] = useState([]);
//   const [pendingEnrollments, setPendingEnrollments] = useState([]);
//   const [approvedEnrollments, setApprovedEnrollments] = useState([]);
//   const [loading, setLoading] = useState({
//     students: false,
//     enrollments: false,
//   });

//   // Summary statistics
//   const studentStats = {
//     pending: pendingStudents.length,
//     approved: approvedStudents.length,
//     total: pendingStudents.length + approvedStudents.length,
//   };

//   const enrollmentStats = {
//     pending: pendingEnrollments.length,
//     approved: approvedEnrollments.length,
//     total: pendingEnrollments.length + approvedEnrollments.length,
//   };

//   const fetchStudentsByStatus = useCallback(async (status, setter) => {
//     try {
//       setLoading((prev) => ({ ...prev, students: true }));
//       const res = await axiosInstance.get(`/admin/students?status=${status}`);
//       setter(res.data.students || []);
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Failed to fetch students");
//     } finally {
//       setLoading((prev) => ({ ...prev, students: false }));
//     }
//   }, []);

//   const fetchEnrollmentsByStatus = useCallback(async (status, setter) => {
//     try {
//       setLoading((prev) => ({ ...prev, enrollments: true }));
//       const res = await axiosInstance.get(
//         `/admin/enrollments?status=${status}`
//       );
//       setter(res.data.enrollments || []);
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Failed to fetch enrollments");
//     } finally {
//       setLoading((prev) => ({ ...prev, enrollments: false }));
//     }
//   }, []);

//   // Student management
//   const handleApproveStudent = async (id) => {
//     try {
//       await axiosInstance.patch(`/admin/students/${id}/approve`);
//       toast.success("✅ Student approved successfully");
//       fetchStudentsByStatus("pending", setPendingStudents);
//       fetchStudentsByStatus("approved", setApprovedStudents);
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Failed to approve student");
//     }
//   };

//   const handleRejectStudent = async (id) => {
//     try {
//       await axiosInstance.patch(`/admin/students/${id}/reject`);
//       toast.info("🚫 Student rejected");
//       fetchStudentsByStatus("pending", setPendingStudents);
//       fetchStudentsByStatus("approved", setApprovedStudents);
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Failed to reject student");
//     }
//   };

//   // Enrollment management
//   const handleApproveEnrollment = async (id) => {
//     try {
//       await axiosInstance.patch(`/admin/enrollments/${id}/approve`);
//       toast.success("✅ Enrollment approved");
//       fetchEnrollmentsByStatus("pending", setPendingEnrollments);
//       fetchEnrollmentsByStatus("approved", setApprovedEnrollments);
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Failed to approve enrollment");
//     }
//   };

//   const handleRejectEnrollment = async (id) => {
//     try {
//       await axiosInstance.patch(`/admin/enrollments/${id}/reject`);
//       toast.info("🚫 Enrollment rejected");
//       fetchEnrollmentsByStatus("pending", setPendingEnrollments);
//       fetchEnrollmentsByStatus("approved", setApprovedEnrollments);
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Failed to reject enrollment");
//     }
//   };

//   // Load data
//   useEffect(() => {
//     fetchStudentsByStatus("pending", setPendingStudents);
//     fetchStudentsByStatus("approved", setApprovedStudents);
//     fetchEnrollmentsByStatus("pending", setPendingEnrollments);
//     fetchEnrollmentsByStatus("approved", setApprovedEnrollments);
//   }, [fetchStudentsByStatus, fetchEnrollmentsByStatus]);

//   return (
//     <div className="admin-dashboard">
//       {/* Welcome Header */}
//       <div className="dashboard-welcome">
//         <h1>Welcome back, {user?.name}!</h1>
//         <p>Here's what's happening with your platform today.</p>
//       </div>

//       {/* Quick Stats */}
//       <div className="quick-stats">
//         <div className="stat-card">
//           <div className="stat-icon">👥</div>
//           <div className="stat-content">
//             <h3>{studentStats.total}</h3>
//             <p>Total Students</p>
//           </div>
//         </div>
//         <div className="stat-card warning">
//           <div className="stat-icon">⏳</div>
//           <div className="stat-content">
//             <h3>{studentStats.pending}</h3>
//             <p>Pending Students</p>
//           </div>
//         </div>
//         <div className="stat-card danger">
//           <div className="stat-icon">📚</div>
//           <div className="stat-content">
//             <h3>{enrollmentStats.pending}</h3>
//             <p>Pending Enrollments</p>
//           </div>
//         </div>
//         <div className="stat-card success">
//           <div className="stat-icon">✅</div>
//           <div className="stat-content">
//             <h3>{enrollmentStats.approved}</h3>
//             <p>Approved Enrollments</p>
//           </div>
//         </div>
//       </div>

//       {/* Pending Actions */}
//       <div className="pending-actions">
//         {/* Pending Students */}
//         <div className="action-section">
//           <h3>Pending Student Approvals ({studentStats.pending})</h3>
//           {loading.students ? (
//             <div className="loading">Loading students...</div>
//           ) : pendingStudents.length === 0 ? (
//             <div className="no-pending">No pending student approvals</div>
//           ) : (
//             <div className="pending-list">
//               {pendingStudents.slice(0, 5).map((student) => (
//                 <div key={student.id} className="pending-item">
//                   <div className="item-info">
//                     <strong>{student.name}</strong>
//                     <span>{student.email}</span>
//                     <small>{student.subject || "No subject"}</small>
//                   </div>
//                   <div className="item-actions">
//                     <button
//                       className="btn-approve"
//                       onClick={() => handleApproveStudent(student.id)}
//                     >
//                       Approve
//                     </button>
//                     <button
//                       className="btn-reject"
//                       onClick={() => handleRejectStudent(student.id)}
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 </div>
//               ))}
//               {pendingStudents.length > 5 && (
//                 <div className="view-all">
//                   <button className="btn-view-all">
//                     View all {pendingStudents.length} pending students
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Pending Enrollments */}
//         <div className="action-section">
//           <h3>Pending Enrollment Approvals ({enrollmentStats.pending})</h3>
//           {loading.enrollments ? (
//             <div className="loading">Loading enrollments...</div>
//           ) : pendingEnrollments.length === 0 ? (
//             <div className="no-pending">No pending enrollment approvals</div>
//           ) : (
//             <div className="pending-list">
//               {pendingEnrollments.slice(0, 5).map((enrollment) => (
//                 <div key={enrollment.id} className="pending-item">
//                   <div className="item-info">
//                     <strong>{enrollment.student?.name || "N/A"}</strong>
//                     <span>{enrollment.course?.title || "N/A"}</span>
//                     <small>Payment: {enrollment.payment_status}</small>
//                   </div>
//                   <div className="item-actions">
//                     <button
//                       className="btn-approve"
//                       onClick={() => handleApproveEnrollment(enrollment.id)}
//                     >
//                       Approve
//                     </button>
//                     <button
//                       className="btn-reject"
//                       onClick={() => handleRejectEnrollment(enrollment.id)}
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 </div>
//               ))}
//               {pendingEnrollments.length > 5 && (
//                 <div className="view-all">
//                   <button className="btn-view-all">
//                     View all {pendingEnrollments.length} pending enrollments
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;






// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [loading, setLoading] = useState({ students: false, enrollments: false });

  const studentStats = {
    pending: pendingStudents.length,
    approved: approvedStudents.length,
    total: pendingStudents.length + approvedStudents.length,
  };

  const enrollmentStats = {
    pending: pendingEnrollments.length,
    approved: approvedEnrollments.length,
    total: pendingEnrollments.length + approvedEnrollments.length,
  };

  const fetchStudentsByStatus = useCallback(async (status, setter) => {
    try {
      setLoading((prev) => ({ ...prev, students: true }));
      const res = await axiosInstance.get(`/admin/students?status=${status}`);
      setter(res.data.students || []);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch students");
    } finally {
      setLoading((prev) => ({ ...prev, students: false }));
    }
  }, []);

  const fetchEnrollmentsByStatus = useCallback(async (status, setter) => {
    try {
      setLoading((prev) => ({ ...prev, enrollments: true }));
      const res = await axiosInstance.get(`/admin/enrollments?status=${status}`);
      setter(res.data.enrollments || []);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch enrollments");
    } finally {
      setLoading((prev) => ({ ...prev, enrollments: false }));
    }
  }, []);

  // ✅ MISSING HANDLERS ADDED HERE
  const handleApproveStudent = async (id) => {
    try {
      await axiosInstance.patch(`/admin/students/${id}/approve`);
      toast.success("✅ Student approved successfully");
      fetchStudentsByStatus("pending", setPendingStudents);
      fetchStudentsByStatus("approved", setApprovedStudents);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to approve student");
    }
  };

  const handleRejectStudent = async (id) => {
    try {
      await axiosInstance.patch(`/admin/students/${id}/reject`);
      toast.info("🚫 Student rejected");
      fetchStudentsByStatus("pending", setPendingStudents);
      fetchStudentsByStatus("approved", setApprovedStudents);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reject student");
    }
  };

  const handleApproveEnrollment = async (id) => {
    try {
      await axiosInstance.patch(`/admin/enrollments/${id}/approve`);
      toast.success("✅ Enrollment approved");
      fetchEnrollmentsByStatus("pending", setPendingEnrollments);
      fetchEnrollmentsByStatus("approved", setApprovedEnrollments);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to approve enrollment");
    }
  };

  const handleRejectEnrollment = async (id) => {
    try {
      await axiosInstance.patch(`/admin/enrollments/${id}/reject`);
      toast.info("🚫 Enrollment rejected");
      fetchEnrollmentsByStatus("pending", setPendingEnrollments);
      fetchEnrollmentsByStatus("approved", setApprovedEnrollments);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reject enrollment");
    }
  };

  useEffect(() => {
    fetchStudentsByStatus("pending", setPendingStudents);
    fetchStudentsByStatus("approved", setApprovedStudents);
    fetchEnrollmentsByStatus("pending", setPendingEnrollments);
    fetchEnrollmentsByStatus("approved", setApprovedEnrollments);
  }, [fetchStudentsByStatus, fetchEnrollmentsByStatus]);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-sm mt-2">Here's what's happening with your platform today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon="👥" title="Total Students" value={studentStats.total} />
        <StatCard icon="⏳" title="Pending Students" value={studentStats.pending} border="border-yellow-500" />
        <StatCard icon="📚" title="Pending Enrollments" value={enrollmentStats.pending} border="border-red-500" />
        <StatCard icon="✅" title="Approved Enrollments" value={enrollmentStats.approved} border="border-green-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ActionSection
          title={`Pending Student Approvals (${studentStats.pending})`}
          items={pendingStudents}
          loading={loading.students}
          onApprove={handleApproveStudent}
          onReject={handleRejectStudent}
          type="student"
        />
        <ActionSection
          title={`Pending Enrollment Approvals (${enrollmentStats.pending})`}
          items={pendingEnrollments}
          loading={loading.enrollments}
          onApprove={handleApproveEnrollment}
          onReject={handleRejectEnrollment}
          type="enrollment"
        />
      </div>
    </div>
  );

  function StatCard({ icon, title, value, border = "border-indigo-500" }) {
    return (
      <div className={`bg-white p-4 rounded-lg shadow-md flex items-center border-l-4 ${border}`}>
        <div className="text-3xl mr-4">{icon}</div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{value}</h3>
          <p className="text-gray-600">{title}</p>
        </div>
      </div>
    );
  }

  function ActionSection({ title, items, loading, onApprove, onReject, type }) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        {loading ? (
          <p className="text-indigo-600 font-medium text-center">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500 text-center italic">No pending {type}s</p>
        ) : (
          <>
            <div className="space-y-3">
              {items.slice(0, 5).map((item) => (
                <div key={item.id} className="bg-gray-100 p-4 rounded flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {type === "student" ? item.name : item.student?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {type === "student" ? item.email : item.course?.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {type === "student" ? item.subject || "No subject" : `Payment: ${item.payment_status}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      onClick={() => onApprove(item.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      onClick={() => onReject(item.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {items.length > 5 && (
              <button className="mt-4 w-full text-indigo-600 hover:underline font-semibold">
                View all {items.length} pending {type}s
              </button>
            )}
          </>
        )}
      </div>
    );
  }
};

export default AdminDashboard;


// // src/components/PendingStudents.jsx
// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import axiosInstance from "../utils/axiosInstance";
// import { useAuth } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";

// const PendingStudents = () => {
//   const { user, isAuthenticated } = useAuth();
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchPendingStudents = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axiosInstance.get("/admin/pending-users");
//       setStudents(data.users || []); // ✅ ensure array
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.error || "Failed to load pending students";
//       toast.error(errorMsg);
//       setStudents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAction = async (id, action) => {
//     try {
//       await axiosInstance.patch(`/admin/users/${id}/approval`, {
//         status: action === "approve" ? "approved" : "rejected",
//       });
//       toast.success(`Student ${action}d successfully`);
//       fetchPendingStudents();
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.error || `Failed to ${action} student`;
//       toast.error(errorMsg);
//     }
//   };

//   useEffect(() => {
//     if (isAuthenticated && user?.role === "admin") {
//       fetchPendingStudents();
//     }
//   }, [isAuthenticated, user]);

//   if (!isAuthenticated || user?.role !== "admin") {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Pending Student Approvals</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : students.length === 0 ? (
//         <p className="text-gray-500">No students pending approval.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="py-2 px-4 border-b">Name</th>
//                 <th className="py-2 px-4 border-b">Email</th>
//                 <th className="py-2 px-4 border-b">Subject</th>
//                 <th className="py-2 px-4 border-b">Status</th>
//                 <th className="py-2 px-4 border-b">Registered At</th>
//                 <th className="py-2 px-4 border-b">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((s) => (
//                 <tr key={s.id} className="hover:bg-gray-50">
//                   <td className="py-2 px-4 border-b">{s.name}</td>
//                   <td className="py-2 px-4 border-b">{s.email}</td>
//                   <td className="py-2 px-4 border-b">{s.subject || "-"}</td>
//                   <td className="py-2 px-4 border-b">{s.approval_status}</td>
//                   <td className="py-2 px-4 border-b">
//                     {new Date(s.createdAt).toLocaleString()}
//                   </td>
//                   <td className="py-2 px-4 border-b space-x-2">
//                     <button
//                       className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
//                       onClick={() => handleAction(s.id, "approve")}
//                     >
//                       Approve
//                     </button>
//                     <button
//                       className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                       onClick={() => handleAction(s.id, "reject")}
//                     >
//                       Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PendingStudents;





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

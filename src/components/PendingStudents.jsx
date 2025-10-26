
// // src/components/PendingStudents.jsx

// import React, { useEffect, useState, useCallback } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { toast } from "react-toastify";
// import { useTheme } from "../context/ThemeContext";

// const PendingStudents = () => {
//   const [pendingStudents, setPendingStudents] = useState([]);
//   const [error, setError] = useState("");
//   const { theme } = useTheme();
//   const isDark = theme === "dark";

//   const fetchPendingStudents = useCallback(async () => {
//     try {
//       const res = await axiosInstance.get("/admin/students?status=pending");
//       setPendingStudents(res.data.students || []);
//     } catch (err) {
//       const msg =
//         err.response?.data?.error || "Failed to load pending students.";
//       setError(msg);
//       toast.error(msg);
//     }
//   }, []);

//   const handleApprove = async (id) => {
//     try {
//       await axiosInstance.patch(`/admin/students/${id}/approve`);
//       toast.success("✅ Student approved successfully");
//       fetchPendingStudents();
//     } catch (err) {
//       const msg = err.response?.data?.error || "Failed to approve student.";
//       toast.error(msg);
//     }
//   };

//   const handleReject = async (id) => {
//     try {
//       await axiosInstance.patch(`/admin/students/${id}/reject`);
//       toast.info("🚫 Student rejected");
//       fetchPendingStudents();
//     } catch (err) {
//       const msg = err.response?.data?.error || "Failed to reject student.";
//       toast.error(msg);
//     }
//   };

//   useEffect(() => {
//     fetchPendingStudents();
//   }, [fetchPendingStudents]);

//   const containerClass = `p-6 rounded-lg shadow-md ${
//     isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
//   }`;

//   const tableClass = `min-w-full border text-sm mt-4 ${
//     isDark ? "border-gray-700 text-gray-200" : "border-gray-300 text-gray-800"
//   }`;

//   return (
//     <div className={containerClass}>
//       <h2 className="text-2xl font-bold mb-4">Pending Student Approvals</h2>

//       {error && <p className="text-red-400">{error}</p>}

//       {pendingStudents.length === 0 ? (
//         <p className="text-gray-400">No pending students found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className={tableClass}>
//             <thead>
//               <tr className={isDark ? "bg-gray-700" : "bg-gray-200"}>
//                 <th className="px-4 py-2">Name</th>
//                 <th className="px-4 py-2">Email</th>
//                 <th className="px-4 py-2">Subject</th>
//                 <th className="px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pendingStudents.map((s) => (
//                 <tr
//                   key={s.id}
//                   className={isDark ? "border-gray-700" : "border-gray-300"}
//                 >
//                   <td className="px-4 py-2">{s.name}</td>
//                   <td className="px-4 py-2">{s.email}</td>
//                   <td className="px-4 py-2">{s.subject || "N/A"}</td>
//                   <td className="px-4 py-2 flex gap-2">
//                     <button
//                       onClick={() => handleApprove(s.id)}
//                       className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => handleReject(s.id)}
//                       className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
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



// src/components/PendingStudents.jsx
import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { showToast } from "../utils/toast";
import { useTheme } from "../context/ThemeContext";

const PendingStudents = () => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [rejectedStudents, setRejectedStudents] = useState([]);
  const [error, setError] = useState("");
  const [loadingStates, setLoadingStates] = useState({});
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const fetchAllStudents = useCallback(async () => {
    try {
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        axiosInstance.get("/admin/students?status=pending"),
        axiosInstance.get("/admin/students?status=approved"),
        axiosInstance.get("/admin/students?status=rejected")
      ]);

      setPendingStudents(pendingRes.data.students || []);
      setApprovedStudents(approvedRes.data.students || []);
      setRejectedStudents(rejectedRes.data.students || []);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to load students.";
      setError(msg);
      showToast.error(msg);
    }
  }, []);

  const handleApprove = async (id) => {
    setLoadingStates(prev => ({ ...prev, [id]: 'approving' }));
    
    try {
      const response = await axiosInstance.patch(`/admin/students/${id}/approve`);
      showToast.success(response.data.message);
      
      // Refresh all lists
      await fetchAllStudents();
      
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to approve student.";
      showToast.error(msg);
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id) => {
    setLoadingStates(prev => ({ ...prev, [id]: 'rejecting' }));
    
    try {
      const response = await axiosInstance.patch(`/admin/students/${id}/reject`);
      showToast.info(response.data.message);
      
      // Refresh all lists
      await fetchAllStudents();
      
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to reject student.";
      showToast.error(msg);
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSendApprovalEmail = async (studentId, studentEmail) => {
    try {
      await axiosInstance.post(`/admin/students/${studentId}/send-approval-email`);
      showToast.success(`Approval email sent to ${studentEmail}`);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send email.";
      showToast.error(msg);
    }
  };

  const handleSendRejectionEmail = async (studentId, studentEmail) => {
    try {
      await axiosInstance.post(`/admin/students/${studentId}/send-rejection-email`);
      showToast.info(`Rejection email sent to ${studentEmail}`);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send email.";
      showToast.error(msg);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, [fetchAllStudents]);

  const containerClass = `p-6 rounded-lg shadow-md ${
    isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
  }`;

  const tableClass = `min-w-full border text-sm ${
    isDark ? "border-gray-700 text-gray-200" : "border-gray-300 text-gray-800"
  }`;

  return (
    <div className="space-y-6">
      {/* Pending Students */}
      <div className={containerClass}>
        <h2 className="text-2xl font-bold mb-4">⏳ Pending Student Approvals</h2>

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
                {pendingStudents.map((student) => (
                  <tr key={student.id} className={isDark ? "border-gray-700" : "border-gray-300"}>
                    <td className="px-4 py-2">{student.name}</td>
                    <td className="px-4 py-2">{student.email}</td>
                    <td className="px-4 py-2">{student.subject || "N/A"}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleApprove(student.id)}
                        disabled={loadingStates[student.id]}
                        className={`px-3 py-1 rounded text-white ${
                          loadingStates[student.id] === 'approving' 
                            ? 'bg-green-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {loadingStates[student.id] === 'approving' ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(student.id)}
                        disabled={loadingStates[student.id]}
                        className={`px-3 py-1 rounded text-white ${
                          loadingStates[student.id] === 'rejecting' 
                            ? 'bg-red-400 cursor-not-allowed' 
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {loadingStates[student.id] === 'rejecting' ? 'Rejecting...' : 'Reject'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approved Students */}
      <div className={containerClass}>
        <h2 className="text-2xl font-bold mb-4">✅ Approved Students</h2>
        
        {approvedStudents.length === 0 ? (
          <p className="text-gray-400">No approved students yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr className={isDark ? "bg-gray-700" : "bg-gray-200"}>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Subject</th>
                  <th className="px-4 py-2">Email Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvedStudents.map((student) => (
                  <tr key={student.id} className={isDark ? "border-gray-700" : "border-gray-300"}>
                    <td className="px-4 py-2">{student.name}</td>
                    <td className="px-4 py-2">{student.email}</td>
                    <td className="px-4 py-2">{student.subject || "N/A"}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleSendApprovalEmail(student.id, student.email)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        📧 Send Welcome Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rejected Students */}
      <div className={containerClass}>
        <h2 className="text-2xl font-bold mb-4">❌ Rejected Students</h2>
        
        {rejectedStudents.length === 0 ? (
          <p className="text-gray-400">No rejected students.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr className={isDark ? "bg-gray-700" : "bg-gray-200"}>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Subject</th>
                  <th className="px-4 py-2">Email Actions</th>
                </tr>
              </thead>
              <tbody>
                {rejectedStudents.map((student) => (
                  <tr key={student.id} className={isDark ? "border-gray-700" : "border-gray-300"}>
                    <td className="px-4 py-2">{student.name}</td>
                    <td className="px-4 py-2">{student.email}</td>
                    <td className="px-4 py-2">{student.subject || "N/A"}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleSendRejectionEmail(student.id, student.email)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
                      >
                        📧 Send Rejection Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingStudents;
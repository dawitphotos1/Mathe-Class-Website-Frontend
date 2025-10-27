
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
  const [emailLoading, setEmailLoading] = useState({});
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
    setEmailLoading(prev => ({ ...prev, [studentId]: 'approval' }));
    
    try {
      await axiosInstance.post(`/admin/students/${studentId}/send-approval-email`);
      showToast.success(`✅ Approval email sent to ${studentEmail}`);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send email.";
      showToast.error(msg);
    } finally {
      setEmailLoading(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const handleSendRejectionEmail = async (studentId, studentEmail) => {
    setEmailLoading(prev => ({ ...prev, [studentId]: 'rejection' }));
    
    try {
      await axiosInstance.post(`/admin/students/${studentId}/send-rejection-email`);
      showToast.info(`📧 Rejection email sent to ${studentEmail}`);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send email.";
      showToast.error(msg);
    } finally {
      setEmailLoading(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const handleSendWelcomeEmail = async (studentId, studentEmail) => {
    setEmailLoading(prev => ({ ...prev, [studentId]: 'welcome' }));
    
    try {
      // You can create a separate welcome email endpoint or use approval email
      await axiosInstance.post(`/admin/students/${studentId}/send-approval-email`);
      showToast.success(`🎉 Welcome email sent to ${studentEmail}`);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send email.";
      showToast.error(msg);
    } finally {
      setEmailLoading(prev => ({ ...prev, [studentId]: false }));
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
        <h2 className="text-2xl font-bold mb-4">✅ Approved Students ({approvedStudents.length})</h2>
        
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
                  <th className="px-4 py-2">Status</th>
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
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        Approved
                      </span>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleSendApprovalEmail(student.id, student.email)}
                        disabled={emailLoading[student.id]}
                        className={`px-3 py-1 rounded text-white ${
                          emailLoading[student.id] === 'approval' 
                            ? 'bg-blue-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {emailLoading[student.id] === 'approval' ? 'Sending...' : '📧 Send Approval Email'}
                      </button>
                      <button
                        onClick={() => handleSendWelcomeEmail(student.id, student.email)}
                        disabled={emailLoading[student.id]}
                        className={`px-3 py-1 rounded text-white ${
                          emailLoading[student.id] === 'welcome' 
                            ? 'bg-purple-400 cursor-not-allowed' 
                            : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                      >
                        {emailLoading[student.id] === 'welcome' ? 'Sending...' : '🎉 Send Welcome Email'}
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
        <h2 className="text-2xl font-bold mb-4">❌ Rejected Students ({rejectedStudents.length})</h2>
        
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
                  <th className="px-4 py-2">Status</th>
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
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                        Rejected
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleSendRejectionEmail(student.id, student.email)}
                        disabled={emailLoading[student.id]}
                        className={`px-3 py-1 rounded text-white ${
                          emailLoading[student.id] === 'rejection' 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gray-600 hover:bg-gray-700'
                        }`}
                      >
                        {emailLoading[student.id] === 'rejection' ? 'Sending...' : '📧 Send Rejection Email'}
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









// // src/components/PendingStudents.jsx
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   Alert,
//   CircularProgress,
//   Grid,
//   IconButton,
//   Tooltip,
// } from "@mui/material";
// import {
//   CheckCircle,
//   Cancel,
//   Email,
//   Celebration,
//   Person,
//   Group,
//   Block,
// } from "@mui/icons-material";
// import axiosInstance from "../utils/axiosInstance";

// const PendingStudents = () => {
//   const [students, setStudents] = useState({
//     pending: [],
//     approved: [],
//     rejected: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
//         axiosInstance.get("/admin/students?status=pending"),
//         axiosInstance.get("/admin/students?status=approved"),
//         axiosInstance.get("/admin/students?status=rejected"),
//       ]);

//       setStudents({
//         pending: pendingRes.data.students || [],
//         approved: approvedRes.data.students || [],
//         rejected: rejectedRes.data.students || [],
//       });
//     } catch (error) {
//       console.error("Error fetching students:", error);
//       setMessage({ type: "error", text: "Failed to load students" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const handleApprove = async (studentId) => {
//     try {
//       await axiosInstance.patch(`/admin/students/${studentId}/approve`);
//       setMessage({ type: "success", text: "Student approved successfully!" });
//       fetchStudents();
//     } catch (error) {
//       console.error("Error approving student:", error);
//       setMessage({ type: "error", text: "Failed to approve student" });
//     }
//   };

//   const handleReject = async (studentId) => {
//     try {
//       await axiosInstance.patch(`/admin/students/${studentId}/reject`);
//       setMessage({ type: "success", text: "Student rejected successfully!" });
//       fetchStudents();
//     } catch (error) {
//       console.error("Error rejecting student:", error);
//       setMessage({ type: "error", text: "Failed to reject student" });
//     }
//   };

//   const handleSendApprovalEmail = async (studentId, studentName) => {
//     try {
//       await axiosInstance.post(
//         `/admin/students/${studentId}/send-approval-email`
//       );
//       setMessage({
//         type: "success",
//         text: `Approval email sent to ${studentName}!`,
//       });
//     } catch (error) {
//       console.error("Error sending approval email:", error);
//       setMessage({ type: "error", text: "Failed to send approval email" });
//     }
//   };

//   const handleSendWelcomeEmail = async (studentId, studentName) => {
//     try {
//       await axiosInstance.post(
//         `/admin/students/${studentId}/send-welcome-email`
//       );
//       setMessage({
//         type: "success",
//         text: `Welcome email sent to ${studentName}!`,
//       });
//     } catch (error) {
//       console.error("Error sending welcome email:", error);
//       setMessage({ type: "error", text: "Failed to send welcome email" });
//     }
//   };

//   const StatusChip = ({ status }) => {
//     const statusConfig = {
//       pending: {
//         color: "warning",
//         label: "Pending",
//         icon: <Person fontSize="small" />,
//       },
//       approved: {
//         color: "success",
//         label: "Approved",
//         icon: <CheckCircle fontSize="small" />,
//       },
//       rejected: {
//         color: "error",
//         label: "Rejected",
//         icon: <Cancel fontSize="small" />,
//       },
//     };

//     const config = statusConfig[status];
//     return (
//       <Chip
//         icon={config.icon}
//         label={config.label}
//         color={config.color}
//         variant="outlined"
//         size="small"
//       />
//     );
//   };

//   const StudentTable = ({ students, status, showActions = false }) => {
//     if (students.length === 0) {
//       return (
//         <Box sx={{ textAlign: "center", py: 4 }}>
//           <Typography variant="body1" color="text.secondary">
//             No {status} students found.
//           </Typography>
//         </Box>
//       );
//     }

//     return (
//       <TableContainer
//         component={Paper}
//         elevation={0}
//         sx={{ border: 1, borderColor: "divider" }}
//       >
//         <Table sx={{ minWidth: 650 }} size="small">
//           <TableHead sx={{ backgroundColor: "grey.50" }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
//                 Student Name
//               </TableCell>
//               <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
//                 Email
//               </TableCell>
//               <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
//                 Subject
//               </TableCell>
//               <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
//                 Status
//               </TableCell>
//               {showActions && (
//                 <TableCell
//                   sx={{ fontWeight: "bold", fontSize: "0.875rem" }}
//                   align="center"
//                 >
//                   Actions
//                 </TableCell>
//               )}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {students.map((student) => (
//               <TableRow
//                 key={student.id}
//                 sx={{
//                   "&:last-child td, &:last-child th": { border: 0 },
//                   "&:hover": { backgroundColor: "action.hover" },
//                 }}
//               >
//                 <TableCell>
//                   <Typography variant="body2" fontWeight="medium">
//                     {student.name}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Typography variant="body2" color="text.secondary">
//                     {student.email}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Chip
//                     label={student.subject}
//                     size="small"
//                     variant="outlined"
//                     color="primary"
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <StatusChip status={student.approval_status} />
//                 </TableCell>
//                 {showActions && (
//                   <TableCell align="center">
//                     <Box
//                       sx={{ display: "flex", gap: 1, justifyContent: "center" }}
//                     >
//                       {student.approval_status === "pending" && (
//                         <>
//                           <Tooltip title="Approve Student">
//                             <IconButton
//                               color="success"
//                               size="small"
//                               onClick={() => handleApprove(student.id)}
//                               sx={{
//                                 backgroundColor: "success.light",
//                                 "&:hover": { backgroundColor: "success.main" },
//                                 color: "white",
//                               }}
//                             >
//                               <CheckCircle fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Reject Student">
//                             <IconButton
//                               color="error"
//                               size="small"
//                               onClick={() => handleReject(student.id)}
//                               sx={{
//                                 backgroundColor: "error.light",
//                                 "&:hover": { backgroundColor: "error.main" },
//                                 color: "white",
//                               }}
//                             >
//                               <Cancel fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         </>
//                       )}
//                       {student.approval_status === "approved" && (
//                         <>
//                           <Tooltip title="Send Approval Email">
//                             <IconButton
//                               color="info"
//                               size="small"
//                               onClick={() =>
//                                 handleSendApprovalEmail(
//                                   student.id,
//                                   student.name
//                                 )
//                               }
//                               sx={{
//                                 backgroundColor: "info.light",
//                                 "&:hover": { backgroundColor: "info.main" },
//                                 color: "white",
//                               }}
//                             >
//                               <Email fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Send Welcome Email">
//                             <IconButton
//                               color="secondary"
//                               size="small"
//                               onClick={() =>
//                                 handleSendWelcomeEmail(student.id, student.name)
//                               }
//                               sx={{
//                                 backgroundColor: "secondary.light",
//                                 "&:hover": {
//                                   backgroundColor: "secondary.main",
//                                 },
//                                 color: "white",
//                               }}
//                             >
//                               <Celebration fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         </>
//                       )}
//                     </Box>
//                   </TableCell>
//                 )}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     );
//   };

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: 400,
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Header */}
//       <Box sx={{ mb: 4 }}>
//         <Typography
//           variant="h4"
//           component="h1"
//           gutterBottom
//           fontWeight="bold"
//           color="primary"
//         >
//           Student Management
//         </Typography>
//         <Typography variant="body1" color="text.secondary">
//           Manage student registrations and send communication emails
//         </Typography>
//       </Box>

//       {/* Stats Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={4}>
//           <Card
//             sx={{ bgcolor: "warning.light", color: "warning.contrastText" }}
//           >
//             <CardContent>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <Box>
//                   <Typography variant="h3" component="div" fontWeight="bold">
//                     {students.pending.length}
//                   </Typography>
//                   <Typography variant="body2">Pending Approval</Typography>
//                 </Box>
//                 <Person sx={{ fontSize: 40, opacity: 0.8 }} />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <Card
//             sx={{ bgcolor: "success.light", color: "success.contrastText" }}
//           >
//             <CardContent>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <Box>
//                   <Typography variant="h3" component="div" fontWeight="bold">
//                     {students.approved.length}
//                   </Typography>
//                   <Typography variant="body2">Approved Students</Typography>
//                 </Box>
//                 <Group sx={{ fontSize: 40, opacity: 0.8 }} />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <Card sx={{ bgcolor: "error.light", color: "error.contrastText" }}>
//             <CardContent>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <Box>
//                   <Typography variant="h3" component="div" fontWeight="bold">
//                     {students.rejected.length}
//                   </Typography>
//                   <Typography variant="body2">Rejected Students</Typography>
//                 </Box>
//                 <Block sx={{ fontSize: 40, opacity: 0.8 }} />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Messages */}
//       {message.text && (
//         <Alert
//           severity={message.type}
//           sx={{ mb: 3 }}
//           onClose={() => setMessage({ type: "", text: "" })}
//         >
//           {message.text}
//         </Alert>
//       )}

//       {/* Pending Students Section */}
//       <Card sx={{ mb: 4 }} elevation={2}>
//         <CardContent>
//           <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//             <Person color="warning" sx={{ mr: 1 }} />
//             <Typography variant="h6" component="h2" fontWeight="bold">
//               Pending Student Approvals ({students.pending.length})
//             </Typography>
//           </Box>
//           <StudentTable
//             students={students.pending}
//             status="pending"
//             showActions={true}
//           />
//         </CardContent>
//       </Card>

//       {/* Approved Students Section */}
//       <Card sx={{ mb: 4 }} elevation={2}>
//         <CardContent>
//           <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//             <CheckCircle color="success" sx={{ mr: 1 }} />
//             <Typography variant="h6" component="h2" fontWeight="bold">
//               Approved Students ({students.approved.length})
//             </Typography>
//           </Box>
//           <StudentTable
//             students={students.approved}
//             status="approved"
//             showActions={true}
//           />
//         </CardContent>
//       </Card>

//       {/* Rejected Students Section */}
//       <Card elevation={2}>
//         <CardContent>
//           <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//             <Cancel color="error" sx={{ mr: 1 }} />
//             <Typography variant="h6" component="h2" fontWeight="bold">
//               Rejected Students ({students.rejected.length})
//             </Typography>
//           </Box>
//           <StudentTable
//             students={students.rejected}
//             status="rejected"
//             showActions={false}
//           />
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default PendingStudents;

 src/components/PendingStudents.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Email,
  Celebration,
  Person,
  Group,
  Block,
} from "@mui/icons-material";
import axiosInstance from "../utils/axiosInstance";

const PendingStudents = () => {
  const [students, setStudents] = useState({
    pending: [],
    approved: [],
    rejected: [],
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        axiosInstance.get("/admin/students?status=pending"),
        axiosInstance.get("/admin/students?status=approved"),
        axiosInstance.get("/admin/students?status=rejected"),
      ]);

      setStudents({
        pending: pendingRes.data.students || [],
        approved: approvedRes.data.students || [],
        rejected: rejectedRes.data.students || [],
      });
    } catch (error) {
      console.error("Error fetching students:", error);
      setMessage({ type: "error", text: "Failed to load students" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleApprove = async (studentId) => {
    try {
      await axiosInstance.patch(`/admin/students/${studentId}/approve`);
      setMessage({ type: "success", text: "Student approved successfully!" });
      fetchStudents();
    } catch (error) {
      console.error("Error approving student:", error);
      setMessage({ type: "error", text: "Failed to approve student" });
    }
  };

  const handleReject = async (studentId) => {
    try {
      await axiosInstance.patch(`/admin/students/${studentId}/reject`);
      setMessage({ type: "success", text: "Student rejected successfully!" });
      fetchStudents();
    } catch (error) {
      console.error("Error rejecting student:", error);
      setMessage({ type: "error", text: "Failed to reject student" });
    }
  };

  const handleSendApprovalEmail = async (studentId, studentName) => {
    try {
      await axiosInstance.post(
        `/admin/students/${studentId}/send-approval-email`
      );
      setMessage({
        type: "success",
        text: `Approval email sent to ${studentName}!`,
      });
    } catch (error) {
      console.error("Error sending approval email:", error);
      setMessage({ type: "error", text: "Failed to send approval email" });
    }
  };

  const handleSendWelcomeEmail = async (studentId, studentName) => {
    try {
      await axiosInstance.post(
        `/admin/students/${studentId}/send-welcome-email`
      );
      setMessage({
        type: "success",
        text: `Welcome email sent to ${studentName}!`,
      });
    } catch (error) {
      console.error("Error sending welcome email:", error);
      setMessage({ type: "error", text: "Failed to send welcome email" });
    }
  };

  const StatusChip = ({ status }) => {
    const statusConfig = {
      pending: {
        color: "warning",
        label: "Pending",
        icon: <Person fontSize="small" />,
      },
      approved: {
        color: "success",
        label: "Approved",
        icon: <CheckCircle fontSize="small" />,
      },
      rejected: {
        color: "error",
        label: "Rejected",
        icon: <Cancel fontSize="small" />,
      },
    };

    const config = statusConfig[status];
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        variant="outlined"
        size="small"
      />
    );
  };

  const StudentTable = ({ students, status, showActions = false }) => {
    if (students.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No {status} students found.
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: 1, borderColor: "divider" }}
      >
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead sx={{ backgroundColor: "grey.50" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                Student Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                Subject
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                Status
              </TableCell>
              {showActions && (
                <TableCell
                  sx={{ fontWeight: "bold", fontSize: "0.875rem" }}
                  align="center"
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow
                key={student.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {student.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {student.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={student.subject}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <StatusChip status={student.approval_status} />
                </TableCell>
                {showActions && (
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      {student.approval_status === "pending" && (
                        <>
                          <Tooltip title="Approve Student">
                            <IconButton
                              color="success"
                              size="small"
                              onClick={() => handleApprove(student.id)}
                              sx={{
                                backgroundColor: "success.light",
                                "&:hover": { backgroundColor: "success.main" },
                                color: "white",
                              }}
                            >
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject Student">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleReject(student.id)}
                              sx={{
                                backgroundColor: "error.light",
                                "&:hover": { backgroundColor: "error.main" },
                                color: "white",
                              }}
                            >
                              <Cancel fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      {student.approval_status === "approved" && (
                        <>
                          <Tooltip title="Send Approval Email">
                            <IconButton
                              color="info"
                              size="small"
                              onClick={() =>
                                handleSendApprovalEmail(
                                  student.id,
                                  student.name
                                )
                              }
                              sx={{
                                backgroundColor: "info.light",
                                "&:hover": { backgroundColor: "info.main" },
                                color: "white",
                              }}
                            >
                              <Email fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Send Welcome Email">
                            <IconButton
                              color="secondary"
                              size="small"
                              onClick={() =>
                                handleSendWelcomeEmail(student.id, student.name)
                              }
                              sx={{
                                backgroundColor: "secondary.light",
                                "&:hover": {
                                  backgroundColor: "secondary.main",
                                },
                                color: "white",
                              }}
                            >
                              <Celebration fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          fontWeight="bold"
          color="primary"
        >
          Student Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage student registrations and send communication emails
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{ bgcolor: "warning.light", color: "warning.contrastText" }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h3" component="div" fontWeight="bold">
                    {students.pending.length}
                  </Typography>
                  <Typography variant="body2">Pending Approval</Typography>
                </Box>
                <Person sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{ bgcolor: "success.light", color: "success.contrastText" }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h3" component="div" fontWeight="bold">
                    {students.approved.length}
                  </Typography>
                  <Typography variant="body2">Approved Students</Typography>
                </Box>
                <Group sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "error.light", color: "error.contrastText" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h3" component="div" fontWeight="bold">
                    {students.rejected.length}
                  </Typography>
                  <Typography variant="body2">Rejected Students</Typography>
                </Box>
                <Block sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Messages */}
      {message.text && (
        <Alert
          severity={message.type}
          sx={{ mb: 3 }}
          onClose={() => setMessage({ type: "", text: "" })}
        >
          {message.text}
        </Alert>
      )}

      {/* Pending Students Section */}
      <Card sx={{ mb: 4 }} elevation={2}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Person color="warning" sx={{ mr: 1 }} />
            <Typography variant="h6" component="h2" fontWeight="bold">
              Pending Student Approvals ({students.pending.length})
            </Typography>
          </Box>
          <StudentTable
            students={students.pending}
            status="pending"
            showActions={true}
          />
        </CardContent>
      </Card>

      {/* Approved Students Section */}
      <Card sx={{ mb: 4 }} elevation={2}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <CheckCircle color="success" sx={{ mr: 1 }} />
            <Typography variant="h6" component="h2" fontWeight="bold">
              Approved Students ({students.approved.length})
            </Typography>
          </Box>
          <StudentTable
            students={students.approved}
            status="approved"
            showActions={true}
          />
        </CardContent>
      </Card>

      {/* Rejected Students Section */}
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Cancel color="error" sx={{ mr: 1 }} />
            <Typography variant="h6" component="h2" fontWeight="bold">
              Rejected Students ({students.rejected.length})
            </Typography>
          </Box>
          <StudentTable
            students={students.rejected}
            status="rejected"
            showActions={false}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default PendingStudents;
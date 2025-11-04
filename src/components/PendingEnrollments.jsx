
// src/components/PendingEnrollments.jsx
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
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
  Grid,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Email,
  AssignmentTurnedIn,
  School,
} from "@mui/icons-material";
import axiosInstance from "../utils/axiosInstance";

const PendingEnrollments = () => {
  const [enrollments, setEnrollments] = useState({
    pending: [],
    approved: [],
    rejected: [],
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        axiosInstance.get("/admin/enrollments?status=pending"),
        axiosInstance.get("/admin/enrollments?status=approved"),
        axiosInstance.get("/admin/enrollments?status=rejected"),
      ]);

      setEnrollments({
        pending: pendingRes.data.enrollments || [],
        approved: approvedRes.data.enrollments || [],
        rejected: rejectedRes.data.enrollments || [],
      });
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setMessage({ type: "error", text: "Failed to load enrollments" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.patch(`/admin/enrollments/${id}/approve`);
      setMessage({ type: "success", text: "Enrollment approved successfully!" });
      fetchEnrollments();
    } catch (error) {
      console.error("Error approving enrollment:", error);
      setMessage({ type: "error", text: "Failed to approve enrollment" });
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.patch(`/admin/enrollments/${id}/reject`);
      setMessage({ type: "success", text: "Enrollment rejected successfully!" });
      fetchEnrollments();
    } catch (error) {
      console.error("Error rejecting enrollment:", error);
      setMessage({ type: "error", text: "Failed to reject enrollment" });
    }
  };

  const handleSendApprovalEmail = async (id, studentName) => {
    try {
      await axiosInstance.post(`/admin/enrollments/${id}/send-approval-email`);
      setMessage({
        type: "success",
        text: `Enrollment approval email sent to ${studentName}!`,
      });
    } catch (error) {
      console.error("Error sending enrollment approval email:", error);
      setMessage({
        type: "error",
        text: "Failed to send enrollment approval email",
      });
    }
  };

  const StatusChip = ({ status }) => {
    const config = {
      pending: { color: "warning", label: "Pending" },
      approved: { color: "success", label: "Approved" },
      rejected: { color: "error", label: "Rejected" },
    }[status];
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const EnrollmentTable = ({ data, status, showActions = false }) => {
    if (data.length === 0)
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No {status} enrollments found.
          </Typography>
        </Box>
      );

    return (
      <TableContainer component={Paper} elevation={0}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: "grey.50" }}>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Status</TableCell>
              {showActions && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((enrollment) => (
              <TableRow key={enrollment.id}>
                <TableCell>{enrollment.student?.name}</TableCell>
                <TableCell>{enrollment.student?.email}</TableCell>
                <TableCell>{enrollment.course?.title}</TableCell>
                <TableCell>
                  <StatusChip status={enrollment.approval_status} />
                </TableCell>
                {showActions && (
                  <TableCell align="center">
                    {enrollment.approval_status === "pending" && (
                      <>
                        <Tooltip title="Approve Enrollment">
                          <IconButton
                            onClick={() => handleApprove(enrollment.id)}
                            color="success"
                            size="small"
                          >
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject Enrollment">
                          <IconButton
                            onClick={() => handleReject(enrollment.id)}
                            color="error"
                            size="small"
                          >
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {enrollment.approval_status === "approved" && (
                      <Tooltip title="Send Enrollment Approval Email">
                        <IconButton
                          onClick={() =>
                            handleSendApprovalEmail(
                              enrollment.id,
                              enrollment.student?.name
                            )
                          }
                          color="info"
                          size="small"
                        >
                          <Email />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (loading)
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" color="primary" mb={2}>
        Enrollment Management
      </Typography>

      {message.text && (
        <Alert
          severity={message.type}
          sx={{ mb: 2 }}
          onClose={() => setMessage({ type: "", text: "" })}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "warning.light", color: "white" }}>
            <CardContent>
              <Typography variant="h3">{enrollments.pending.length}</Typography>
              <Typography>Pending Enrollments</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "success.light", color: "white" }}>
            <CardContent>
              <Typography variant="h3">{enrollments.approved.length}</Typography>
              <Typography>Approved</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: "error.light", color: "white" }}>
            <CardContent>
              <Typography variant="h3">{enrollments.rejected.length}</Typography>
              <Typography>Rejected</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Pending Enrollments ({enrollments.pending.length})
          </Typography>
          <EnrollmentTable
            data={enrollments.pending}
            status="pending"
            showActions={true}
          />
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Approved Enrollments ({enrollments.approved.length})
          </Typography>
          <EnrollmentTable
            data={enrollments.approved}
            status="approved"
            showActions={true}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Rejected Enrollments ({enrollments.rejected.length})
          </Typography>
          <EnrollmentTable
            data={enrollments.rejected}
            status="rejected"
            showActions={false}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default PendingEnrollments;

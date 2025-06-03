
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/pending-users');
      const data = await res.json();
      setPendingUsers(data);
    } catch (err) {
      console.error('Error fetching pending users:', err);
    }
  }, []);

  const fetchPendingEnrollments = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/enrollments/pending');
      const data = await res.json();
      setPendingEnrollments(data);
    } catch (err) {
      console.error('Error fetching pending enrollments:', err);
    }
  }, []);

  const fetchApprovedEnrollments = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/enrollments/approved');
      const data = await res.json();
      setApprovedEnrollments(data);
    } catch (err) {
      console.error('Error fetching approved enrollments:', err);
    }
  }, []);

  useEffect(() => {
    fetchPendingUsers();
  }, [fetchPendingUsers]);

  useEffect(() => {
    fetchPendingEnrollments();
    fetchApprovedEnrollments();
  }, [fetchPendingEnrollments, fetchApprovedEnrollments]);

  useEffect(() => {
    if (pendingUsers.length && pendingEnrollments.length && approvedEnrollments.length) {
      setLoading(false);
    }
  }, [pendingUsers, pendingEnrollments, approvedEnrollments]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Pending Users</h2>
        {pendingUsers.map(user => (
          <div key={user.id}>{user.email}</div>
        ))}
      </section>

      <section>
        <h2>Pending Enrollments</h2>
        {pendingEnrollments.map(enroll => (
          <div key={enroll.id}>{enroll.courseTitle}</div>
        ))}
      </section>

      <section>
        <h2>Approved Enrollments</h2>
        {approvedEnrollments.map(enroll => (
          <div key={enroll.id}>{enroll.courseTitle}</div>
        ))}
      </section>
    </div>
  );
};

export default AdminDashboard;
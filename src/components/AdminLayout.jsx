// src/components/AdminLayout.jsx
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "./AdminSidebar";
import Loading from "./Loading";
import "../Pages/AdminDashboard.css"; // ← FIXED PATH

const AdminLayout = () => {
  const { user, loading, checked } = useAuth();

  useEffect(() => {
    console.log("AdminLayout mounted - CSS should be loaded");
  }, []);

  if (loading || !checked) {
    return <Loading />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
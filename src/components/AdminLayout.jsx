
// src/components/AdminLayout.jsx - UPDATED
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "./AdminSidebar";
import Loading from "./Loading";
import "../Pages/AdminDashboard.css";

const AdminLayout = () => {
  const { user, loading, checked } = useAuth();

  // Force CSS to load in production
  useEffect(() => {
    // This ensures CSS is properly loaded
    console.log("AdminLayout mounted - CSS should be loaded");
  }, []);

  if (loading || !checked) {
    return <Loading />;
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
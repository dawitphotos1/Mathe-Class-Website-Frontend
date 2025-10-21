
// src/components/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "./AdminSidebar";
import Loading from "./Loading";
import "../Pages/AdminDashboard.css";

const AdminLayout = () => {
  const { user, loading, checked } = useAuth();

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

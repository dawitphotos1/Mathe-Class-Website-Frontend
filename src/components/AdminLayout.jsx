
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "./AdminSidebar";
import Loading from "./Loading";

const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />; // wait until auth check is finished
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;


// // src/components/AdminLayout.jsx
// import React from "react";
// import { Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import AdminSidebar from "./AdminSidebar";
// import Loading from "./Loading";

// const AdminLayout = () => {
//   const { user, loading, checked } = useAuth();

//   // Wait until auth verification finishes
//   if (loading || !checked) {
//     return <Loading />;
//   }

//   // ⚠️ Important: don't handle role access here
//   // ProtectedRoute already prevents non-admins from reaching this component

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md">
//         <AdminSidebar />
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 overflow-y-auto p-6">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;





// src/components/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "./AdminSidebar";
import Loading from "./Loading";
import "./AdminLayout.css";

const AdminLayout = () => {
  const { user, loading, checked } = useAuth();

  if (loading || !checked) return <Loading />;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <AdminSidebar />
      </aside>
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

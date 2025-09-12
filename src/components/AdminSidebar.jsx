
// import React, { useContext } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";

// const AdminSidebar = () => {
//   const { user } = useContext(AuthContext);
//   const location = useLocation();

//   if (!user || user.role !== "admin") {
//     return null; // hide sidebar if not admin
//   }

//   const navItems = [
//     { path: "/admindashboard", label: "Dashboard" },
//     { path: "/admin/pending-students", label: "Pending Approvals" }, // ✅ new link
//     { path: "/admin/manage-courses", label: "Manage Courses" },
//     { path: "/admin/manage-users", label: "Manage Users" },
//   ];

//   return (
//     <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
//       <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
//       <ul className="space-y-2">
//         {navItems.map((item) => (
//           <li key={item.path}>
//             <Link
//               to={item.path}
//               className={`block px-3 py-2 rounded ${
//                 location.pathname === item.path
//                   ? "bg-gray-700 font-semibold"
//                   : "hover:bg-gray-800"
//               }`}
//             >
//               {item.label}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AdminSidebar;


import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { PendingContext } from "../../context/PendingContext";

const AdminSidebar = () => {
  const { user } = useContext(AuthContext);
  const { pendingCount, fetchPendingCount } = useContext(PendingContext);
  const location = useLocation();

  useEffect(() => {
    if (user?.role === "admin") {
      fetchPendingCount();
    }
  }, [user, fetchPendingCount]);

  if (!user || user.role !== "admin") {
    return null;
  }

  const navItems = [
    { path: "/admindashboard", label: "Dashboard" },
    {
      path: "/admin/pending-students",
      label: "Pending Approvals",
      badge: pendingCount,
    },
    { path: "/admin/manage-courses", label: "Manage Courses" },
    { path: "/admin/manage-users", label: "Manage Users" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex justify-between items-center px-3 py-2 rounded ${
                location.pathname === item.path
                  ? "bg-gray-700 font-semibold"
                  : "hover:bg-gray-800"
              }`}
            >
              <span>{item.label}</span>
              {item.badge > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;

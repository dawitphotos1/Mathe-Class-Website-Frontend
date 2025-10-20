
// // src/components/AdminSidebar.jsx
// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import {
//   LayoutDashboard,
//   Users,
//   FileText,
//   BookOpen,
//   Clock,
//   Menu,
//   X,
// } from "lucide-react";

// const AdminSidebar = () => {
//   const { user } = useAuth();
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(true);

//   if (!user || user.role !== "admin") return null;

//   const navItems = [
//     { path: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
//     { path: "/admin/pending-students", label: "Pending Approvals", icon: <Clock size={18} /> },
//     { path: "/admin/manage-courses", label: "Manage Courses", icon: <BookOpen size={18} /> },
//     { path: "/admin/manage-users", label: "Manage Users", icon: <Users size={18} /> },
//     { path: "/admin/files", label: "File Manager", icon: <FileText size={18} /> },
//   ];

//   return (
//     <>
//       {/* Mobile toggle button */}
//       <button
//         className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {isOpen ? <X size={20} /> : <Menu size={20} />}
//       </button>

//       {/* Sidebar */}
//       <aside
//         className={`${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0 fixed md:static top-0 left-0 z-40 w-64 h-screen bg-gray-900 text-white flex flex-col transition-transform duration-300 ease-in-out`}
//       >
//         <div className="p-4 border-b border-gray-800">
//           <h2 className="text-xl font-bold text-white tracking-wide">
//             Admin Panel
//           </h2>
//           <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
//         </div>

//         <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//           {navItems.map((item) => {
//             const isActive = location.pathname === item.path;
//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
//                   isActive
//                     ? "bg-gray-700 font-semibold text-white"
//                     : "text-gray-300 hover:bg-gray-800 hover:text-white"
//                 }`}
//               >
//                 {item.icon}
//                 <span>{item.label}</span>
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Footer */}
//         <div className="p-4 border-t border-gray-800 text-sm text-gray-400">
//           <p>© {new Date().getFullYear()} Math Class Admin</p>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default AdminSidebar;




// src/components/AdminSidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  Clock,
  Menu,
  X,
} from "lucide-react";

const AdminSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/admin/pending-students", label: "Pending Approvals", icon: <Clock size={18} /> },
    { path: "/admin/manage-courses", label: "Manage Courses", icon: <BookOpen size={18} /> },
    { path: "/admin/manage-users", label: "Manage Users", icon: <Users size={18} /> },
    { path: "/admin/files", label: "File Manager", icon: <FileText size={18} /> },
  ];

  if (!user || user.role !== "admin") return null;

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static top-0 left-0 z-40 w-64 h-screen bg-gray-900 text-white transition-transform duration-300`}
      >
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ path, label, icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-gray-800 text-white font-semibold"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Math Class Admin
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

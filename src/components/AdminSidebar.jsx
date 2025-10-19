
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
import { useTheme } from "../context/ThemeContext";

const AdminSidebar = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  if (!user || user.role !== "admin") return null;

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/pending-students", label: "Pending Approvals", icon: "⏳" },
    { path: "/admin/manage-courses", label: "Manage Courses", icon: "📚" },
    { path: "/admin/manage-users", label: "Manage Users", icon: "👥" },
    { path: "/admin/files", label: "File Manager", icon: "📁" },
  ];

  // Determine colors based on theme
  const isDark = theme === "dark";
  const sidebarBg = isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800";
  const borderColor = isDark ? "border-gray-800" : "border-gray-300";
  const hoverBg = isDark ? "hover:bg-gray-800" : "hover:bg-gray-200";
  const activeBg = isDark ? "bg-gray-700" : "bg-gray-300";
  const activeText = isDark ? "text-white" : "text-black";

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className={`md:hidden fixed top-4 left-4 z-50 p-2 ${
          isDark ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
        } rounded-md shadow`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "❌" : "☰"}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static top-0 left-0 z-40 w-64 h-screen flex flex-col transition-transform duration-300 ease-in-out ${sidebarBg}`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${borderColor} flex justify-between items-center`}>
          <div>
            <h2 className="text-xl font-bold tracking-wide">Admin Panel</h2>
            <p className="text-sm opacity-75 truncate">{user?.email}</p>
          </div>

          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className={`text-lg px-2 py-1 rounded ${
              isDark ? "hover:bg-gray-800" : "hover:bg-gray-200"
            }`}
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          >
            {isDark ? "🌞" : "🌙"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? `${activeBg} font-semibold ${activeText}`
                    : `opacity-90 ${hoverBg}`
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t ${borderColor} text-sm opacity-70`}>
          <p>© {new Date().getFullYear()} Math Class Admin</p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

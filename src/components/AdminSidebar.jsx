
// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import {
//   FaTachometerAlt,
//   FaUsers,
//   FaBookOpen,
//   FaFileAlt,
//   FaCheckCircle,
// } from "react-icons/fa";
// import "../Pages/AdminDashboard.css";

// const AdminSidebar = () => {
//   const { user } = useAuth();
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(true);

//   if (!user || user.role !== "admin") return null;

//   const navItems = [
//     { path: "/admin", label: "Dashboard", icon: <FaTachometerAlt /> },
//     {
//       path: "/admin/pending-students",
//       label: "Pending Approvals",
//       icon: <FaCheckCircle />,
//     },
//     {
//       path: "/admin/manage-courses",
//       label: "Manage Courses",
//       icon: <FaBookOpen />,
//     },
//     { path: "/admin/manage-users", label: "Manage Users", icon: <FaUsers /> },
//     { path: "/admin/files", label: "File Manager", icon: <FaFileAlt /> },
//   ];

//   return (
//     <>
//       {/* Mobile toggle button */}
//       <button className="sidebar-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
//         {isOpen ? "✖" : "☰"}
//       </button>

//       <aside className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
//         <div className="admin-sidebar-top">
//           <h2>Admin Panel</h2>
//           <p>{user?.email}</p>
//         </div>

//         <nav className="admin-nav">
//           {navItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`admin-nav-link ${
//                 location.pathname === item.path ? "active" : ""
//               }`}
//             >
//               <span className="nav-icon">{item.icon}</span>
//               <span className="nav-label">{item.label}</span>
//             </Link>
//           ))}
//         </nav>

//         <footer className="admin-sidebar-footer">
//           © 2025 Math Class Admin
//         </footer>
//       </aside>
//     </>
//   );
// };

// export default AdminSidebar;


import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaTachometerAlt,
  FaUsers,
  FaBookOpen,
  FaFileAlt,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "../Pages/AdminDashboard.css";

const AdminSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapse state on mount
  useEffect(() => {
    const savedState = localStorage.getItem("adminSidebarCollapsed");
    if (savedState === "true") {
      setIsCollapsed(true);
    }
  }, []);

  // Save collapse state on change
  useEffect(() => {
    localStorage.setItem("adminSidebarCollapsed", isCollapsed);
  }, [isCollapsed]);

  if (!user || user.role !== "admin") return null;

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <FaTachometerAlt /> },
    {
      path: "/admin/pending-students",
      label: "Pending Approvals",
      icon: <FaCheckCircle />,
    },
    {
      path: "/admin/manage-courses",
      label: "Manage Courses",
      icon: <FaBookOpen />,
    },
    { path: "/admin/manage-users", label: "Manage Users", icon: <FaUsers /> },
    { path: "/admin/files", label: "File Manager", icon: <FaFileAlt /> },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button className="sidebar-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖" : "☰"}
      </button>

      <aside
        className={`admin-sidebar ${isOpen ? "open" : "closed"} ${
          isCollapsed ? "collapsed" : ""
        }`}
      >
        <div className="admin-sidebar-top">
          <h2 className="sidebar-title">{!isCollapsed && "Admin Panel"}</h2>
          {!isCollapsed && <p className="sidebar-email">{user?.email}</p>}
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <div key={item.path} className="tooltip-wrapper">
              <Link
                to={item.path}
                className={`admin-nav-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && (
                  <span className="nav-label">{item.label}</span>
                )}
              </Link>
              {isCollapsed && (
                <span className="tooltip-text">{item.label}</span>
              )}
            </div>
          ))}
        </nav>

        <footer className="admin-sidebar-footer">
          {!isCollapsed && "© 2025 Math Class Admin"}
        </footer>

        {/* Collapse / Expand button */}
        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </aside>
    </>
  );
};

export default AdminSidebar;

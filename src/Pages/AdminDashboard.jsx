// import React, { useState, useEffect, useCallback, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { CSVLink } from "react-csv";
// import { API_BASE_URL } from "../config";
// import { AuthContext } from "../context/AuthContext";
// import "./AdminDashboard.css";

// const AdminDashboard = () => {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [dashboardStats, setDashboardStats] = useState({
//     totalStudents: 0,
//     pendingUsers: 0,
//     pendingEnrollments: 0,
//     approvedEnrollments: 0,
//   });

//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [approvedUsers, setApprovedUsers] = useState([]);
//   const [rejectedUsers, setRejectedUsers] = useState([]);
//   const [pendingEnrollments, setPendingEnrollments] = useState([]);
//   const [approvedEnrollments, setApprovedEnrollments] = useState([]);
//   const [emailStatusMap, setEmailStatusMap] = useState({}); // NEW: store email sent/failed status
//   const [activeTab, setActiveTab] = useState("pendingUsers");
//   const [darkMode, setDarkMode] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("token");
//     return { Authorization: `Bearer ${token}` };
//   };

//   const handleError = useCallback(
//     (err) => {
//       console.error("Error details:", err);
//       const status = err.response?.status;
//       const message =
//         err.response?.data?.error || err.message || "Something went wrong";

//       if (status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         toast.error("Session expired. Please log in again.");
//         navigate("/login");
//       } else if (err.message.includes("CORS")) {
//         toast.error("CORS error: Unable to connect to the server.");
//       } else {
//         toast.error(message);
//       }
//     },
//     [navigate]
//   );

//   const fetchDashboardStats = useCallback(async () => {
//     try {
//       const headers = getAuthHeaders();
//       const response = await axios.get(
//         `${API_BASE_URL}/api/v1/admin/dashboard`,
//         { headers }
//       );
//       setDashboardStats(response.data);
//     } catch (err) {
//       handleError(err);
//     }
//   }, [handleError]);

//   const fetchData = useCallback(async () => {
//     try {
//       const headers = getAuthHeaders();

//       const [
//         pendingRes,
//         approvedRes,
//         rejectedRes,
//         pendingEnrollRes,
//         approvedEnrollRes,
//       ] = await Promise.all([
//         axios.get(`${API_BASE_URL}/api/v1/admin/pending-users`, { headers }),
//         axios.get(`${API_BASE_URL}/api/v1/admin/users?status=approved`, {
//           headers,
//         }),
//         axios.get(`${API_BASE_URL}/api/v1/admin/users?status=rejected`, {
//           headers,
//         }),
//         axios.get(`${API_BASE_URL}/api/v1/admin/enrollments?status=pending`, {
//           headers,
//         }),
//         axios.get(`${API_BASE_URL}/api/v1/admin/enrollments?status=approved`, {
//           headers,
//         }),
//       ]);

//       setPendingUsers(pendingRes.data || []);
//       setApprovedUsers(approvedRes.data || []);
//       setRejectedUsers(rejectedRes.data || []);
//       setPendingEnrollments(pendingEnrollRes.data?.enrollments || []);
//       setApprovedEnrollments(approvedEnrollRes.data?.enrollments || []);
//     } catch (err) {
//       handleError(err);
//     }
//   }, [handleError]);

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     fetchDashboardStats();
//     fetchData();
//   }, [user, navigate, fetchDashboardStats, fetchData]);

//   const updateEmailStatus = (userId, sent) => {
//     setEmailStatusMap((prev) => ({
//       ...prev,
//       [userId]: sent,
//     }));
//   };

//   const handleApproveUser = async (id) => {
//     try {
//       const { data } = await axios.patch(
//         `${API_BASE_URL}/api/v1/admin/approve/${id}`,
//         {},
//         { headers: getAuthHeaders() }
//       );

//       updateEmailStatus(id, data.emailSent);

//       if (data.emailSent) {
//         toast.success("✅ User approved — email sent");
//       } else {
//         toast.warn("⚠️ User approved — email failed to send");
//       }

//       fetchDashboardStats();
//       fetchData();
//     } catch (err) {
//       handleError(err);
//     }
//   };

//   const handleRejectUser = async (id) => {
//     try {
//       const { data } = await axios.patch(
//         `${API_BASE_URL}/api/v1/admin/reject/${id}`,
//         {},
//         { headers: getAuthHeaders() }
//       );

//       updateEmailStatus(id, data.emailSent);

//       if (data.emailSent) {
//         toast.success("✅ User rejected — email sent");
//       } else {
//         toast.warn("⚠️ User rejected — email failed to send");
//       }

//       fetchDashboardStats();
//       fetchData();
//     } catch (err) {
//       handleError(err);
//     }
//   };

//   const filtered = (arr) =>
//     (arr || []).filter(
//       (u) =>
//         u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         u.email?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   const currentUsers =
//     {
//       pendingUsers,
//       approvedUsers,
//       rejectedUsers,
//     }[activeTab] || [];

//   const csvFileName = `${activeTab}.csv`;

//   return (
//     <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
//       <div className="dashboard-header">
//         <h2>Admin Dashboard</h2>
//         <button onClick={() => setDarkMode(!darkMode)}>
//           {darkMode ? "☀️ Light" : "🌙 Dark"}
//         </button>
//       </div>

//       <div className="summary-cards">
//         <div className="summary-card">
//           👨‍🎓 Total Students
//           <br />
//           {dashboardStats.totalStudents}
//         </div>
//         <div className="summary-card">
//           🕒 Pending Users
//           <br />
//           {dashboardStats.pendingUsers}
//         </div>
//         <div className="summary-card">
//           ❌ Rejected Users
//           <br />
//           {rejectedUsers.length}
//         </div>
//         <div className="summary-card">
//           📥 Pending Enrollments
//           <br />
//           {dashboardStats.pendingEnrollments}
//         </div>
//         <div className="summary-card">
//           ✅ Approved Enrollments
//           <br />
//           {dashboardStats.approvedEnrollments}
//         </div>
//       </div>

//       <div className="admin-tabs">
//         <button
//           onClick={() => setActiveTab("pendingUsers")}
//           className={activeTab === "pendingUsers" ? "tab-active" : ""}
//         >
//           👤 Pending Users
//         </button>
//         <button
//           onClick={() => setActiveTab("approvedUsers")}
//           className={activeTab === "approvedUsers" ? "tab-active" : ""}
//         >
//           ✅ Approved Users
//         </button>
//         <button
//           onClick={() => setActiveTab("rejectedUsers")}
//           className={activeTab === "rejectedUsers" ? "tab-active" : ""}
//         >
//           ❌ Rejected Users
//         </button>
//         <button
//           onClick={() => setActiveTab("pendingEnrollments")}
//           className={activeTab === "pendingEnrollments" ? "tab-active" : ""}
//         >
//           📥 Pending Enrollments
//         </button>
//         <button
//           onClick={() => setActiveTab("approvedEnrollments")}
//           className={activeTab === "approvedEnrollments" ? "tab-active" : ""}
//         >
//           📘 Approved Enrollments
//         </button>
//       </div>

//       <div className="dashboard-actions">
//         <input
//           type="text"
//           placeholder="Search name or email"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         {["pendingUsers", "approvedUsers", "rejectedUsers"].includes(
//           activeTab
//         ) && (
//           <CSVLink
//             data={filtered(currentUsers)}
//             filename={csvFileName}
//             className="btn-secondary"
//           >
//             Export CSV
//           </CSVLink>
//         )}
//       </div>

//       {activeTab === "pendingUsers" && (
//         <UserTable
//           title="Pending Users"
//           users={filtered(pendingUsers)}
//           emailStatusMap={emailStatusMap}
//           actions={(u) => (
//             <>
//               <button
//                 className="btn-approve"
//                 onClick={() => handleApproveUser(u.id)}
//               >
//                 Approve
//               </button>
//               <button
//                 className="btn-reject"
//                 onClick={() => handleRejectUser(u.id)}
//               >
//                 Reject
//               </button>
//             </>
//           )}
//         />
//       )}

//       {activeTab === "approvedUsers" && (
//         <UserTable
//           title="Approved Users"
//           users={filtered(approvedUsers)}
//           columns={["Name", "Email", "Role"]}
//           emailStatusMap={emailStatusMap}
//           renderRow={(u) => [u.name, u.email, u.role]}
//         />
//       )}

//       {activeTab === "rejectedUsers" && (
//         <UserTable
//           title="Rejected Users"
//           users={filtered(rejectedUsers)}
//           columns={["Name", "Email", "Role"]}
//           emailStatusMap={emailStatusMap}
//           renderRow={(u) => [u.name, u.email, u.role]}
//         />
//       )}

//       {activeTab === "pendingEnrollments" && (
//         <UserTable
//           title="Pending Enrollments"
//           users={pendingEnrollments}
//           columns={["Name", "Course"]}
//           renderRow={(e) => [e.User?.name, e.Course?.title]}
//         />
//       )}

//       {activeTab === "approvedEnrollments" && (
//         <UserTable
//           title="Approved Enrollments"
//           users={approvedEnrollments}
//           columns={["Name", "Course"]}
//           renderRow={(e) => [e.User?.name, e.Course?.title]}
//         />
//       )}
//     </div>
//   );
// };

// const UserTable = ({
//   title,
//   users,
//   columns = ["Name", "Email"],
//   renderRow,
//   actions,
//   rowClass = "",
//   emailStatusMap = {},
// }) => (
//   <div>
//     <h3>{title}</h3>
//     <table className="user-table">
//       <thead>
//         <tr>
//           {columns.map((col, idx) => (
//             <th key={idx}>{col}</th>
//           ))}
//           {actions && <th>Actions</th>}
//         </tr>
//       </thead>
//       <tbody>
//         {users.map((u) => (
//           <tr key={u.id} className={rowClass}>
//             {(renderRow ? renderRow(u) : [u.name, u.email]).map((cell, idx) => (
//               <td key={idx}>
//                 {cell}
//                 {idx === 0 && emailStatusMap[u.id] !== undefined && (
//                   <span style={{ marginLeft: "8px" }}>
//                     {emailStatusMap[u.id] ? "✅" : "⚠️"}
//                   </span>
//                 )}
//               </td>
//             ))}
//             {actions && <td>{actions(u)}</td>}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// export default AdminDashboard;




import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    pendingUsers: 0,
    pendingEnrollments: 0,
    approvedEnrollments: 0,
  });

  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [activeTab, setActiveTab] = useState("pendingUsers");
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const handleError = useCallback(
    (err) => {
      console.error("Error details:", err);
      const status = err.response?.status;
      const message =
        err.response?.data?.error || err.message || "Something went wrong";

      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else if (err.message.includes("CORS")) {
        toast.error("CORS error: Unable to connect to the server.");
      } else {
        toast.error(message);
      }
    },
    [navigate]
  );

  const fetchDashboardStats = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/admin/dashboard`,
        { headers }
      );
      setDashboardStats(response.data);
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  const fetchData = useCallback(async () => {
    try {
      const headers = getAuthHeaders();

      const [
        pendingRes,
        approvedRes,
        rejectedRes,
        pendingEnrollRes,
        approvedEnrollRes,
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/admin/pending-users`, { headers }),
        axios.get(`${API_BASE_URL}/api/v1/admin/users?status=approved`, {
          headers,
        }),
        axios.get(`${API_BASE_URL}/api/v1/admin/users?status=rejected`, {
          headers,
        }),
        axios.get(`${API_BASE_URL}/api/v1/admin/enrollments?status=pending`, {
          headers,
        }),
        axios.get(`${API_BASE_URL}/api/v1/admin/enrollments?status=approved`, {
          headers,
        }),
      ]);

      setPendingUsers(pendingRes.data || []);
      setApprovedUsers(approvedRes.data || []);
      setRejectedUsers(rejectedRes.data || []);
      setPendingEnrollments(pendingEnrollRes.data?.enrollments || []);
      setApprovedEnrollments(approvedEnrollRes.data?.enrollments || []);
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchDashboardStats();
    fetchData();
  }, [user, navigate, fetchDashboardStats, fetchData]);

  const handleApproveUser = async (id) => {
    try {
      const { data } = await axios.patch(
        `${API_BASE_URL}/api/v1/admin/approve/${id}`,
        {},
        { headers: getAuthHeaders() }
      );

      if (data.emailSent) {
        toast.success("✅ User approved — email sent");
      } else {
        toast.warn("⚠️ User approved — email failed to send");
      }

      fetchDashboardStats();
      fetchData();
    } catch (err) {
      handleError(err);
    }
  };

  const handleRejectUser = async (id) => {
    try {
      const { data } = await axios.patch(
        `${API_BASE_URL}/api/v1/admin/reject/${id}`,
        {},
        { headers: getAuthHeaders() }
      );

      if (data.emailSent) {
        toast.success("✅ User rejected — email sent");
      } else {
        toast.warn("⚠️ User rejected — email failed to send");
      }

      fetchDashboardStats();
      fetchData();
    } catch (err) {
      handleError(err);
    }
  };

  const filtered = (arr) =>
    (arr || []).filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const currentUsers =
    {
      pendingUsers,
      approvedUsers,
      rejectedUsers,
    }[activeTab] || [];

  const csvFileName = `${activeTab}.csv`;

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          👨‍🎓 Total Students
          <br />
          {dashboardStats.totalStudents}
        </div>
        <div className="summary-card">
          🕒 Pending Users
          <br />
          {dashboardStats.pendingUsers}
        </div>
        <div className="summary-card">
          ❌ Rejected Users
          <br />
          {rejectedUsers.length}
        </div>
        <div className="summary-card">
          📥 Pending Enrollments
          <br />
          {dashboardStats.pendingEnrollments}
        </div>
        <div className="summary-card">
          ✅ Approved Enrollments
          <br />
          {dashboardStats.approvedEnrollments}
        </div>
      </div>

      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab("pendingUsers")}
          className={activeTab === "pendingUsers" ? "tab-active" : ""}
        >
          👤 Pending Users
        </button>
        <button
          onClick={() => setActiveTab("approvedUsers")}
          className={activeTab === "approvedUsers" ? "tab-active" : ""}
        >
          ✅ Approved Users
        </button>
        <button
          onClick={() => setActiveTab("rejectedUsers")}
          className={activeTab === "rejectedUsers" ? "tab-active" : ""}
        >
          ❌ Rejected Users
        </button>
        <button
          onClick={() => setActiveTab("pendingEnrollments")}
          className={activeTab === "pendingEnrollments" ? "tab-active" : ""}
        >
          📥 Pending Enrollments
        </button>
        <button
          onClick={() => setActiveTab("approvedEnrollments")}
          className={activeTab === "approvedEnrollments" ? "tab-active" : ""}
        >
          📘 Approved Enrollments
        </button>
      </div>

      <div className="dashboard-actions">
        <input
          type="text"
          placeholder="Search name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {["pendingUsers", "approvedUsers", "rejectedUsers"].includes(
          activeTab
        ) && (
          <CSVLink
            data={filtered(currentUsers)}
            filename={csvFileName}
            className="btn-secondary"
          >
            Export CSV
          </CSVLink>
        )}
      </div>

      {activeTab === "pendingUsers" && (
        <UserTable
          title="Pending Users"
          users={filtered(pendingUsers)}
          actions={(u) => (
            <>
              <button
                className="btn-approve"
                onClick={() => handleApproveUser(u.id)}
              >
                Approve
              </button>
              <button
                className="btn-reject"
                onClick={() => handleRejectUser(u.id)}
              >
                Reject
              </button>
            </>
          )}
        />
      )}

      {activeTab === "approvedUsers" && (
        <UserTable
          title="Approved Users"
          users={filtered(approvedUsers)}
          columns={["Name", "Email", "Role"]}
          renderRow={(u) => [u.name, u.email, u.role]}
        />
      )}

      {activeTab === "rejectedUsers" && (
        <UserTable
          title="Rejected Users"
          users={filtered(rejectedUsers)}
          columns={["Name", "Email", "Role"]}
          renderRow={(u) => [u.name, u.email, u.role]}
        />
      )}

      {activeTab === "pendingEnrollments" && (
        <UserTable
          title="Pending Enrollments"
          users={pendingEnrollments}
          columns={["Name", "Course"]}
          renderRow={(e) => [e.User?.name, e.Course?.title]}
        />
      )}

      {activeTab === "approvedEnrollments" && (
        <UserTable
          title="Approved Enrollments"
          users={approvedEnrollments}
          columns={["Name", "Course"]}
          renderRow={(e) => [e.User?.name, e.Course?.title]}
        />
      )}
    </div>
  );
};

const UserTable = ({
  title,
  users,
  columns = ["Name", "Email"],
  renderRow,
  actions,
  rowClass = "",
}) => (
  <div>
    <h3>{title}</h3>
    <table className="user-table">
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col}</th>
          ))}
          {actions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} className={rowClass}>
            {(renderRow ? renderRow(u) : [u.name, u.email]).map((cell, idx) => (
              <td key={idx}>
                {cell}
                {idx === 0 && u.email_notification_status && (
                  <span style={{ marginLeft: "8px" }}>
                    {u.email_notification_status === "sent" ? "✅" : "⚠️"}
                  </span>
                )}
              </td>
            ))}
            {actions && <td>{actions(u)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AdminDashboard;

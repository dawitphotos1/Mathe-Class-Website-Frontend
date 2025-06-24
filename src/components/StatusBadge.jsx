
// ✅ Modular Component: StatusBadge.jsx
import React from "react";

const StatusBadge = ({ status }) => {
  const isApproved = status === "approved";
  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-full ${
        isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {isApproved ? "✅ Approved" : "⏳ Pending"}
    </span>
  );
};

export default StatusBadge;
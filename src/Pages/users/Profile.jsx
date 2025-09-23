// src/Pages/users/Profile.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

import adminAvatar from "../../assets/images/admin.avif";
import teacherAvatar from "../../assets/images/teacher.jpeg";
import defaultAvatar from "../../assets/images/student.jpeg";

const Profile = () => {
  const { user, loading } = useAuth();

  // ✅ Loading state from context
  if (loading) return <p className="loading">Loading profile...</p>;
  if (!user) return <p className="error">No user data available</p>;

  // ✅ Avatar logic
  const getInitialsAvatar = (name = "User") => {
    const initials = name
      .split(" ")
      .map((n) => n[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const svg = `
      <svg width="110" height="110" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="55" cy="55" r="55" fill="url(#grad)" />
        <text x="50%" y="50%" dy=".35em" text-anchor="middle" fill="#fff" font-family="Outfit, sans-serif" font-weight="600" font-size="48">
          ${initials}
        </text>
      </svg>`;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  let avatarSrc;
  switch (user?.role) {
    case "admin":
      avatarSrc = adminAvatar;
      break;
    case "teacher":
      avatarSrc = teacherAvatar;
      break;
    case "student":
      avatarSrc = defaultAvatar;
      break;
    default:
      avatarSrc = null;
  }

  avatarSrc = user?.avatar || avatarSrc || getInitialsAvatar(user?.name || "User");

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar-wrapper">
          <img src={avatarSrc} alt="User Avatar" className="profile-avatar" />
        </div>
        <h1>{user?.name || "User"}</h1>
      </div>

      <div className="profile-details">
        <p>
          <strong>Name:</strong> {user?.name || "-"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || "-"}
        </p>
        <p>
          <strong>Role:</strong> {user?.role || "-"}
        </p>
        <p>
          <strong>Approval Status:</strong> {user?.approval_status || "-"}
        </p>
      </div>
    </div>
  );
};

export default Profile;

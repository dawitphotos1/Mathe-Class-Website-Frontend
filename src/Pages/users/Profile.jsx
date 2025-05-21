
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view your profile.");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data || !res.data.id) {
          throw new Error("Invalid user data received.");
        }

        setUser(res.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Failed to fetch user data.";
        setError(errorMessage);
        toast.error(errorMessage);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (error) return <div className="profile-error">{error}</div>;
  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-image-wrapper">
          <img
            className="profile-image"
            src={
              user.profilePicture ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Profile"
          />
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          {user.subject && (
            <p>
              <strong>Subject:</strong> {user.subject}
            </p>
          )}
          {user.approvalStatus && (
            <p>
              <strong>Status:</strong> {user.approvalStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;



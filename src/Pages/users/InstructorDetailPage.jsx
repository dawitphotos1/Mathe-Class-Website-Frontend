import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./Profile.css"; // Reuse profile styles

const InstructorDetailPage = () => {
  const { state } = useLocation();
  const instructor = state?.instructor || {};

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Instructor Profile</h2>
          <Link to="/" className="btn btn-outline">
            Back to Home
          </Link>
        </div>

        <div className="profile-info">
          <div className="avatar-container">
            <img
              src={instructor.image || "/default-instructor.jpg"}
              alt={instructor.name}
              className="profile-avatar"
            />
          </div>

          <div className="profile-details">
            <div className="detail-group">
              <h1>{instructor.name}</h1>
              <h2 className="instructor-expertise">{instructor.expertise}</h2>
              <p className="experience">
                <i className="fas fa-award"></i>
                {instructor.experience}+ years experience
              </p>
            </div>

            <div className="detail-group">
              <h3>About Me</h3>
              <p className="bio">{instructor.bio}</p>
            </div>

            <div className="contact-section">
              <button className="btn btn-primary">
                <i className="fas fa-envelope"></i> Contact Instructor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetailPage;

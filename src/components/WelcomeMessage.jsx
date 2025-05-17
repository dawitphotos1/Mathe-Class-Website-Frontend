import React from "react";

const WelcomeMessage = () => {
  const userName = localStorage.getItem("userName") || "Student";

  return (
    <div className="welcome-banner">
      <h2>Welcome, {userName}! 🎉</h2>
      <p>Your account has been successfully created</p>
    </div>
  );
};

export default WelcomeMessage;

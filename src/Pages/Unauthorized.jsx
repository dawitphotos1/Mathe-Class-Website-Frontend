// import React from "react";
// import { Link } from "react-router-dom";

// const Unauthorized = () => {
//   return (
//     <div
//       className="unauthorized-page"
//       style={{ textAlign: "center", padding: "2rem" }}
//     >
//       <h1>🚫 Unauthorized</h1>
//       <p>You do not have permission to access this page.</p>
//       <Link to="/">⬅️ Go back to Home</Link>
//     </div>
//   );
// };

// export default Unauthorized;



import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🚫 Access Denied</h1>
      <p style={styles.message}>
        Sorry, you don't have permission to view this page.
      </p>
      <Link to="/" style={styles.link}>
        ⬅️ Go back to Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "3rem",
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    borderRadius: "12px",
    margin: "2rem auto",
    maxWidth: "500px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },
  link: {
    textDecoration: "none",
    fontWeight: "bold",
    color: "#1d4ed8",
    fontSize: "1rem",
  },
};

export default Unauthorized;

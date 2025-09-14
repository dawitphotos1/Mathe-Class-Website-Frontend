// import React from "react";
// import { Link } from "react-router-dom";

// const Unauthorized = () => {
//   return (
//     <div style={styles.container}>
//       <h1 style={styles.heading}>🚫 Access Denied</h1>
//       <p style={styles.message}>
//         Sorry, you don't have permission to view this page.
//       </p>
//       <Link to="/" style={styles.link}>
//         ⬅️ Go back to Home
//       </Link>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     textAlign: "center",
//     padding: "3rem",
//     backgroundColor: "#fef2f2",
//     color: "#991b1b",
//     borderRadius: "12px",
//     margin: "2rem auto",
//     maxWidth: "500px",
//     boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
//   },
//   heading: {
//     fontSize: "2rem",
//     marginBottom: "1rem",
//   },
//   message: {
//     fontSize: "1.2rem",
//     marginBottom: "2rem",
//   },
//   link: {
//     textDecoration: "none",
//     fontWeight: "bold",
//     color: "#1d4ed8",
//     fontSize: "1rem",
//   },
// };

// export default Unauthorized;



import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="container mx-auto text-center p-8 bg-red-50 text-red-800 rounded-xl max-w-lg my-8 shadow-lg">
      <h1 className="text-3xl font-bold mb-4">🚫 Access Denied</h1>
      <p className="text-lg mb-6">
        Sorry, you don't have permission to view this page.
      </p>
      <div className="space-y-4">
        <Link to="/" className="text-blue-600 font-semibold hover:underline">
          ⬅️ Go back to Home
        </Link>
        <p>
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Log in
          </Link>
          {" or "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
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
    <div
      className="unauthorized-page"
      style={{ textAlign: "center", padding: "2rem" }}
    >
      <h1>🚫 Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <Link to="/">⬅️ Go back to Home</Link>
    </div>
  );
};

export default Unauthorized;

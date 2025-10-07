// import React from "react";

// const EnvironmentCheck = () => {
//   return (
//     <div
//       style={{
//         padding: "20px",
//         background: "#f5f5f5",
//         margin: "10px",
//         borderRadius: "5px",
//       }}
//     >
//       <h3>Environment Check</h3>
//       <pre>
//         {JSON.stringify(
//           {
//             REACT_APP_STRIPE_PUBLISHABLE_KEY: process.env
//               .REACT_APP_STRIPE_PUBLISHABLE_KEY
//               ? "SET"
//               : "MISSING",
//             REACT_APP_API_URL: process.env.REACT_APP_API_URL,
//             NODE_ENV: process.env.NODE_ENV,
//           },
//           null,
//           2
//         )}
//       </pre>
//     </div>
//   );
// };

// export default EnvironmentCheck;





import React from "react";

const EnvironmentCheck = () => {
  return (
    <div
      style={{
        padding: "20px",
        background: "#f5f5f5",
        margin: "10px",
        borderRadius: "5px",
      }}
    >
      <h3>Environment Check</h3>
      <pre>
        {JSON.stringify(
          {
            REACT_APP_STRIPE_PUBLISHABLE_KEY: process.env
              .REACT_APP_STRIPE_PUBLISHABLE_KEY
              ? "SET"
              : "MISSING",
            REACT_APP_API_URL: process.env.REACT_APP_API_URL,
            NODE_ENV: process.env.NODE_ENV,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
};

export default EnvironmentCheck;
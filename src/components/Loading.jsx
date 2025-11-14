// // components/Loading.jsx

// import React from "react";

// const Loading = () => {
//   return <div>Loading...</div>;
// };

// export default Loading;




// src/components/Loading.jsx
import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
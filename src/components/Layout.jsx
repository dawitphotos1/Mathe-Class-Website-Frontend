// import React from "react";
// import Navbar from "./Navbar";


// const Layout = ({ user, onLogout, children }) => (
//   <>
//     <Navbar user={user} onLogout={onLogout} />
//     <main>{children}</main>
//     {/* <ToastContainer /> */}
//   </>
// );

// export default Layout;






import React from "react";
import Navbar from "./Navbar";

const Layout = ({ user, onLogout, children }) => (
  <>
    <Navbar user={user} onLogout={onLogout} />
    <main>{children}</main>
    {/* <ToastContainer /> */}
  </>
);

export default Layout;

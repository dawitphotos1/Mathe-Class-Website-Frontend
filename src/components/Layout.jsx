import React from "react";
import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";

const Layout = ({ user, onLogout, children }) => (
  <>
    <Navbar user={user} onLogout={onLogout} />
    <main>{children}</main>
    <ToastContainer />
  </>
);

export default Layout;

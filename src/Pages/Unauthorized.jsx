
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
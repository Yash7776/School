import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-red-700 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Oops! Page not found.</p>
      <Link
        to="/"
        className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;

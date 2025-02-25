import React from "react";
import { Link } from "react-router-dom";
import logo from "../../public/logo-no-bg.png";

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="PaperSphere Logo" className="h-10 w-auto" />
          <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
            PaperSphere
          </Link>
        </div>

        {/* Links */}
        <div className="space-x-4">
          <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
            Home
          </Link>
          <Link to="/search" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
            Search
          </Link>
          <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
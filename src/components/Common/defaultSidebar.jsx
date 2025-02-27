import React, { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { MdOutlineDashboard, MdOutlineLogout } from "react-icons/md";
import { VscSignIn } from "react-icons/vsc";
import { FaUserPlus } from "react-icons/fa6";
import { useSidebar } from "../../context/SidebarContext";

const StickySidebar = () => {
  const location = useLocation();
  const { authState, logout } = useAuth();
  const { token, role, user } = authState;
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  // Memoize the callback to avoid re-renders
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const sidebarClass = isSidebarOpen
    ? 'block'
    : 'hidden lg:block';  // Simplified class handling

  return (
    <div
      className={`fixed z-300 top-0 left-0 w-48 lg:w-48 h-full text-black flex flex-col space-y-6 bg-navbar shadow-md transition-all dark:bg-navbar-dark ${sidebarClass}`}
    >
      <div className="w-full h-32 flex justify-center items-center border-b-2">
        <Link to="/">
          <img
            src="/images/logo.png"
            alt="Logo"
            width={100}
            height={100}
          />
        </Link>
      </div>
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-2xl text-gray-600 lg:hidden" // Hidden on screens larger than 768px
        onClick={toggleSidebar}
      >
        ×
      </button>
      {!token ? (
        <ul className="flex flex-col gap-10 ml-6">
          <li>
            <Link
              to="/signin"
              className="text-lg font-semibold hover:text-yellow-400 flex items-center dark:text-white dark:hover:text-yellow-400"
            >
              <VscSignIn className="mr-2" />
              Sign In
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              className="text-lg font-semibold hover:text-yellow-400 flex items-center dark:text-white dark:hover:text-yellow-400"
            >
              <FaUserPlus className="mr-2" />
              Sign Up
            </Link>
          </li>
        </ul>
      ) : (
        <ul className="flex flex-col gap-10 ml-6">
          <li>
            <Link
              to={`/${role}/dashboard`}
              className="text-lg font-semibold hover:text-yellow-400 flex items-center dark:text-white dark:hover:text-yellow-400"
            >
              <MdOutlineDashboard className="mr-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <button
              className="text-lg font-semibold hover:text-yellow-400 flex items-center dark:text-white dark:hover:text-yellow-400"
              onClick={handleLogout}  // Now using the memoized callback
            >
              <MdOutlineLogout className="mr-2" />
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default StickySidebar;

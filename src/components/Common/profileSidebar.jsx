import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
import useAuth from "../../hooks/useAuth";

const SideBar = () => {
  const { logout, authState } = useAuth();
  const { role } = authState;
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  // Memoize toggleSidebar function to prevent unnecessary re-renders
  const handleToggleSidebar = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  // Memoize the logout function to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  // Conditionally apply classes to sidebar visibility
  const sidebarClasses = `fixed top-0 left-0 h-screen w-48 bg-navbar shadow-md flex flex-col justify-between transition-all ${isSidebarOpen ? "block" : "hidden"} lg:block dark:bg-navbar-dark`;

  const linkClasses = (isActive) =>
    `${isActive ? "border-b-2 border-primary-500" : ""} text-lg font-semibold hover:text-black p-4 flex items-center cursor-pointer hover:bg-gray-200 dark:text-gray-100 dark:hover:text-black`;

  return (
    <div className="relative z-50">
      {/* Sidebar */}
      <div className={sidebarClasses}>
        {/* Top Section */}
        <div>
          <div className="w-full h-32 flex justify-center items-center border-b-2">
            <NavLink to="/">
              <img src="/images/logo.png" alt="Logo" width={100} height={100} />
            </NavLink>
          </div>
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-2xl text-gray-600 lg:hidden"
            onClick={handleToggleSidebar} // Memoized handler for toggle
          >
            ×
          </button>
          <ul className="mt-4">
            <li>
              <NavLink to={`/${role}/dashboard/profile`} className={({ isActive }) => linkClasses(isActive)}>
                <span className="mr-2">👤</span> Profile
              </NavLink>
            </li>
            <li>
              <NavLink to={`/${role}/dashboard/overview`} className={({ isActive }) => linkClasses(isActive)}>
                <span className="mr-2">📊</span> Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={`/${role}/dashboard/applications`} className={({ isActive }) => linkClasses(isActive)}>
                <span className="mr-2">📄</span> Applications
              </NavLink>
            </li>
            <li>
              <NavLink to="/institutesearch" className={({ isActive }) => linkClasses(isActive)}>
                <span className="mr-2">🔍</span> Explore
              </NavLink>
            </li>
            <li>
              <NavLink to={`/${role}/dashboard/setting`} className={({ isActive }) => linkClasses(isActive)}>
                <span className="mr-2">⚙️</span> Settings
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Bottom Section */}
        <div>
          <button
            className="w-full bg-button hover:bg-button-hover dark:bg-button-dark dark:hover:bg-button-darkhover text-white p-4 flex items-center font-semibold space-x-2"
            onClick={handleLogout} // Memoized handler for logout
          >
            <span>🔓</span>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;

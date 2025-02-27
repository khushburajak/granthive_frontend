import React from 'react';
import { FaBars } from "react-icons/fa"; // Import icon for the hamburger button
import SideBar from '../Common/profileSidebar';
import { Outlet } from 'react-router-dom';
import { useSidebar } from "../../context/SidebarContext";

const StudentDashboard = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <div className="relative">
      {/* Sidebar Component */}
      <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Hamburger Button for mobile view */}
      <button
        aria-label="Toggle Sidebar"
        className={`absolute top-4 left-4 p-2 text-white bg-button dark:bg-button-dark rounded-full transition-all z-50 ${isSidebarOpen ? 'opacity-0' : 'opacity-100'} lg:hidden`} // Make the button hidden on larger screens
        onClick={toggleSidebar} // Toggle sidebar on click
      >
        <FaBars size={24} />
      </button>

      {/* Main Content */}
      <div className={`lg:ml-48 transition-all`}>
        <Outlet /> {/* Render child routes */}
      </div>
    </div>
  );
};

export default React.memo(StudentDashboard); // Memoize the component for performance

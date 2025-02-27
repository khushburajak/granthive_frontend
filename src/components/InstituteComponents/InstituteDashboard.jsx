import React, { useMemo } from 'react';
import { FaBars } from "react-icons/fa";
import { Outlet } from 'react-router-dom';
import { useSidebar } from "../../context/SidebarContext";

// Lazy load the SideBar to improve the initial load time
const SideBar = React.lazy(() => import('../Common/profileSidebar'));

function InstituteDashboard() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  // Memoize the button class name to avoid recalculating on every render
  const buttonClassName = useMemo(() => {
    return `absolute top-4 left-4 p-2 text-white bg-button dark:bg-button-dark rounded-full transition-all z-50 ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`;
  }, [isSidebarOpen]);

  return (
    <div className="relative dark:bg-dark">
      {/* Sidebar Component with lazy loading */}
      <React.Suspense fallback={<div>Loading...</div>}>
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </React.Suspense>

      {/* Hamburger Button for mobile view */}
      <button className={buttonClassName} onClick={toggleSidebar}>
        <FaBars size={24} />
      </button>

      {/* Main Content */}
      <div className={`lg:ml-48 transition-all`}>
        <Outlet />
      </div>
    </div>
  );
}

export default InstituteDashboard;


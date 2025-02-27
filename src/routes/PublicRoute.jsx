import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa"; // Hamburger icon
import { useLocation, Outlet } from "react-router-dom";
import SideBar from "../components/Common/defaultSidebar";
import { useSidebar } from "../context/SidebarContext";

const PublicRoute = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const location = useLocation(); // Get current URL path
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen size and update isMobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // You can adjust 1024 to your preferred breakpoint
    };

    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize); // Update on window resize

    return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
  }, []);

  // Don't show sidebar on institutesearch path for desktop view
  const shouldHideSidebar = location.pathname === "/institutesearch" && !isMobile;

  return (
    <div className="relative">
      {!shouldHideSidebar && (
        <div>
          {/* Sidebar component */}
          <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          {/* Hamburger button for mobile view */}
          <button
            className={`absolute top-4 left-4 p-2 text-white bg-button dark:bg-button-dark rounded-full transition-all z-50 ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`}
            onClick={toggleSidebar}  // Toggle the sidebar on click
          >
            <FaBars size={24} />
          </button>
        </div>
      )}

      {/* Main content */}
      <div
        className={`transition-all ${location.pathname !== "/institutesearch" ? "lg:ml-48" : ""}`}
      >
        <Outlet /> {/* Render child routes */}
      </div>
    </div>
  );
};

export default PublicRoute;

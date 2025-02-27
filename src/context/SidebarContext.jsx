import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Create Context
const SidebarContext = createContext();

// Create Provider
export const SidebarProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default is open for larger screens
    const [screenSize, setScreenSize] = useState(window.innerWidth);

    // Function to check screen width and update sidebar state
    const checkScreenSize = useCallback(() => {
        const newScreenSize = window.innerWidth;
        setScreenSize(newScreenSize);
        setIsSidebarOpen(newScreenSize >= 768); // Auto-collapse for small screens
    }, []);

    // Toggle sidebar manually
    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen((prev) => !prev); // Force open/close the sidebar
    }, []);

    // Hook to update sidebar state on screen resize with debouncing
    useEffect(() => {
        checkScreenSize(); // Check initial screen size

        // Debounce function to limit the number of times resize event handler is called
        const debouncedResizeHandler = () => {
            clearTimeout(debouncedResizeHandler.timeoutId);
            debouncedResizeHandler.timeoutId = setTimeout(checkScreenSize, 200); // Delay resize event by 200ms
        };

        // Event listener for window resize
        window.addEventListener("resize", debouncedResizeHandler);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener("resize", debouncedResizeHandler);
            clearTimeout(debouncedResizeHandler.timeoutId); // Cleanup timeout on unmount
        };
    }, [checkScreenSize]); // Dependency on checkScreenSize to avoid stale closures

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};

// Custom hook to access sidebar state
export const useSidebar = () => useContext(SidebarContext);

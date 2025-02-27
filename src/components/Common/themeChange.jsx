import React, { useState, useEffect, useCallback } from "react";

export const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  // Memoize the effect to prevent unnecessary re-renders when darkMode is toggled
  const updateDarkMode = useCallback(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Run the effect to update dark mode class on page load and change
  useEffect(() => {
    updateDarkMode();
  }, [darkMode, updateDarkMode]);

  return (
    <div className="flex">
      {/* Hidden checkbox that acts as the toggle */}
      <input
        type="checkbox"
        id="dark-mode-toggle"
        className="peer hidden"
        checked={darkMode}
        onChange={() => setDarkMode((prevState) => !prevState)} // Avoid unnecessary re-renders
        aria-label="Toggle Dark Mode" // Accessibility improvement
      />
      <label
        htmlFor="dark-mode-toggle"
        className="w-20 h-10 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 peer-checked:from-blue-400 peer-checked:to-indigo-500 transition-all duration-500 cursor-pointer relative"
      >
        {/* The circle */}
        <span
          className="after:content-['☀️'] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-8 after:w-8 after:flex after:items-center after:justify-center after:transition-all after:duration-500 dark:after:translate-x-10 dark:after:content-['🌙'] after:shadow-md after:text-lg"
        />
      </label>
    </div>
  );
};

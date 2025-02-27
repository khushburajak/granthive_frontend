import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApplicationFromStudent } from '../../services/applicationService';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Move theme logic into a separate hook or utility
  const initializeTheme = () => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    initializeTheme(); // Initialize the theme once on mount

    const fetchApplications = async () => {
      try {
        const response = await getApplicationFromStudent(); // Fetch data
        setApplications(response.data.applications); // Store applications
      } catch (err) {
        setError("Failed to load applications. Please try again."); // Set error state
      } finally {
        setLoading(false); // Set loading to false after data fetch
      }
    };

    fetchApplications(); // Call fetch function
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-background-dark">
        <span>Loading applications...</span>
      </div>
    ); // Display loading state
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <span>{error}</span> {/* Show error message */}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 dark:bg-background-dark">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
          Applications
        </h1>
      </header>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map((application) => (
            <div
              key={application._id}
              className="border border-gray-300 rounded-lg p-4 flex justify-between items-center bg-white dark:bg-container-dark dark:text-white"
            >
              <div className="flex-1">
                <h2 className="text-lg font-medium">
                  {application.course_id?.title || "No Title Available"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Submitted on {new Date(application.SubmittedDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-2 rounded font-medium text-sm ${
                    application.Status === 'Submitted'
                      ? 'bg-yellow-100 text-yellow-800'
                      : application.Status === 'Accepted'
                      ? 'bg-green-100 text-green-800'
                      : application.Status === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {application.Status}
                </span>
                <Link
                  to={`/student/dashboard/applicationdetails`}
                  state={{ id: application._id }} // Pass the ID dynamically
                  className="bg-button text-white px-4 py-2 rounded hover:bg-button-hover dark:bg-button-dark dark:text-black dark:hover:bg-button-darkhover dark:hover:text-white"
                >
                  View
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No applications found.</p> // Fallback message if no applications
        )}
      </div>
    </div>
  );
};

export default Applications;

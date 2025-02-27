import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getApplicationByInstitute } from '../../services/applicationService';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dark theme initialization
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    try {
      const response = await getApplicationByInstitute();
      setApplications(response.data.applications || []);
    } catch (err) {
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Define status styles
  const getStatusClass = (status) => {
    switch (status) {
      case 'Submitted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-white';
      case 'Accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-white';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-darki dark:text-white';
    }
  };

  if (loading) {
    return <p>Loading applications...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen dark:bg-background-dark">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white text-center lg:text-left md:text-3xl">
          Applications
        </h1>
      </header>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map((application) => (
            <div
              key={application._id}
              className="border border-gray-300 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-container-dark dark:text-white"
            >
              <div className="mb-4 sm:mb-0">
                <h2 className="text-lg sm:text-base font-medium justify-self-center md:justify-self-start">
                  {application.course_id?.title || 'No Title Available'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-white">
                  Submitted on {new Date(application.SubmittedDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <span
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded font-medium text-xs sm:text-sm ${getStatusClass(application.Status)}`}
                >
                  {application.Status}
                </span>
                <Link
                  to={`/institution/dashboard/applicationdetail`}
                  state={{ id: application._id }} // Pass ID in state
                  className="bg-button hover:bg-button-hover text-white px-3 py-1 sm:px-4 sm:py-2 rounded dark:bg-button-dark dark:hover:bg-button-darkhover dark:text-black text-xs sm:text-sm"
                >
                  View
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No applications found</p>
        )}
      </div>
    </div>
  );
};

export default Applications;

import React, { useState, useEffect, useMemo } from 'react';
import { getApplicationByInstitute } from '../../services/applicationService';
import { getCourseByInstitute } from '../../services/courseService';

const Overview = () => {
  const [applications, setApplications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize theme for dark mode
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  // Fetch applications and courses concurrently using Promise.all
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicationsRes, coursesRes] = await Promise.all([
          getApplicationByInstitute(),
          getCourseByInstitute(),
        ]);

        setApplications(applicationsRes.data.applications);
        setCourses(coursesRes.data);
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoized calculations
  const totalApplications = useMemo(() => applications.length, [applications]);
  const totalAcceptedApplications = useMemo(() => 
    applications.filter(app => app.Status === 'Accepted').length, [applications]
  );
  const totalPendingApplications = useMemo(() => 
    applications.filter(app => app.Status === 'Submitted').length, [applications]
  );
  const totalCourses = useMemo(() => courses.length, [courses]);

  if (loading) {
    return (
      <div className="min-h-screen p-6 sm:p-8 lg:p-10 bg-gray-50 dark:bg-background-dark">
        <h1>Loading Overview...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 sm:p-8 lg:p-10 bg-gray-50 dark:bg-background-dark">
        <h1>{error}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 sm:p-8 lg:p-10 bg-gray-50 dark:bg-background-dark">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 md:text-left justify-self-center lg:justify-self-start">
          Overview
        </h1>
      </header>

      {/* Overview Summary */}
      <div className="w-full bg-button text-white rounded-3xl p-4 sm:p-5 mb-5 dark:bg-button-dark dark:text-black">
        <h2 className="text-3xl sm:text-4xl font-bold">Here's your overview</h2>
        <p className="text-sm sm:text-base">
          You have <span>{totalPendingApplications}</span> applications pending.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Applicants */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg dark:bg-container-dark border border-gray-300">
          <h2 className="text-lg sm:text-xl font-medium text-gray-700 dark:text-white">
            Total Applicants
          </h2>
          <p className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mt-2">
            {totalApplications}
          </p>
        </div>

        {/* Accepted Applications */}
        <div className="bg-white dark:bg-container-dark p-4 sm:p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-lg sm:text-xl font-medium text-gray-700 dark:text-white">
            Applications Accepted
          </h2>
          <p className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 mt-2">
            {totalAcceptedApplications}
          </p>
        </div>

        {/* Total Courses */}
        <div className="bg-white dark:bg-container-dark p-4 sm:p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-lg sm:text-xl font-medium text-black dark:text-white">
            Total Courses
          </h2>
          <p className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 mt-2">
            {totalCourses}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Overview;

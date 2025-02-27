import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { getApplicationFromStudent } from '../../services/applicationService';

function Overview() {
  const { authState } = useAuth();
  const { user } = authState;
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Handle error state

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getApplicationFromStudent();
        setApplications(response.data.applications); // Extract the applications array from the response
      } catch (err) {
        setError("Failed to load applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []); // Only run once on mount

  const totalApplications = applications.length;
  const acceptedApplications = applications.filter(app => app.Status === 'Accepted');
  const pendingApplications = applications.filter(app => app.Status === 'Submitted');

  const scholarships = [
    { id: 1, name: 'Scholarship_1', university: 'University_1', amount: 'Rs.15,000/-', due: '4 days' },
    { id: 2, name: 'Scholarship_2', university: 'University_2', amount: 'Rs.20,000/-', due: '6 days' },
    { id: 3, name: 'Scholarship_3', university: 'University_3', amount: 'Rs.10,000/-', due: '2 days' },
  ];

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  if (loading) {
    return <div className="min-h-screen p-10 dark:bg-background-dark">Loading...</div>; // Provide loading feedback
  }

  if (error) {
    return <div className="min-h-screen p-10 dark:bg-background-dark text-red-500">{error}</div>; // Error state
  }

  return (
    <div className="min-h-screen p-10 dark:bg-background-dark">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 justify-self-center lg:justify-self-start">
          Overview
        </h1>
      </header>

      {/* Welcome Message */}
      <div className="w-full bg-button text-white rounded-3xl p-5 mb-5 dark:bg-button-dark dark:text-black">
        <h2 className="text-4xl font-bold">Welcome Back, {user?.name}</h2>
        <p>You have <span>{totalApplications}</span> applications, {pendingApplications.length} pending.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Application Submitted */}
        <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-container-dark">
          <h2 className="text-xl font-medium text-gray-700 dark:text-white">
            Applications Submitted
          </h2>
          <p className="text-3xl font-semibold text-gray-800 dark:text-white mt-2">{totalApplications}</p>
        </div>

        {/* Applications Accepted */}
        <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-container-dark">
          <h2 className="text-xl font-medium text-gray-700 dark:text-white">
            Applications Accepted
          </h2>
          <p className="text-3xl font-semibold text-gray-800 dark:text-white mt-2">{acceptedApplications.length}</p>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-container-dark">
          <h2 className="text-xl font-medium text-gray-700 dark:text-white">
            Upcoming Deadlines
          </h2>
          <p className="text-3xl font-semibold text-gray-800 dark:text-white mt-2">{scholarships.length}</p>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="bg-gray-100 dark:bg-container-dark rounded-lg shadow-md p-4 w-full">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Recent Matches</h2>
        {scholarships.map((scholarship) => (
          <div key={scholarship.id} className="flex justify-between items-center border-b border-gray-300 py-3">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                {scholarship.name} at {scholarship.university}
              </h3>
              <p className="text-gray-600 text-sm dark:text-gray-300">
                {scholarship.amount} - Due in {scholarship.due}
              </p>
            </div>
            <Link
              to={`/student/dashboard/scholarshipdetail/${scholarship.id}`}
              className="bg-button text-white dark:bg-button-dark dark:text-black px-4 py-2 rounded-lg hover:bg-button-hover dark:hover:bg-button-darkhover dark:hover:text-white"
            >
              Apply Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Overview;

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getApplicationById, updateApplicationStatus } from "../../services/applicationService";

const ApplicationDetails = () => {
  const [application, setApplication] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const location = useLocation();
  const { id } = location.state || {}; // Get ID from state

  // Format date to YYYY-MM-DD
  const formatToYYYYMMDD = (dateString) => {
    if (!dateString) return ""; // Handle empty value
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus); // API call
      const response = await getApplicationById(id);
      setApplication(response.data.application);
      setStatus(newStatus); // Update UI instantly
    } catch (error) {
      console.error("Failed to update status:", error);
      setError(error);
    }
  };

  // Fetch application details
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      if (!id) {
        setError(new Error("No ID provided"));
        setLoading(false);
        return;
      }

      try {
        const response = await getApplicationById(id);
        setApplication(response.data.application);
        setStudentInfo(response.data.studentProfile);
        setStatus(response.data.application.Status);
      } catch (err) {
        setError(err);
        console.error("Error fetching application details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  if (loading) {
    return <div>Loading application details...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!application) {
    return <div>Application not found.</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-background-dark dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded shadow mb-6 dark:bg-container-dark">
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-start w-full">
          {/* Name and Details Section */}
          <div className="text-center md:text-left">
            <h1 className="text-xl font-bold">{application.userId?.name}'s Applications:</h1>
            <p className="text-gray-500 text-sm dark:text-white">
              {application.userId?.name} <br />
              Applied For: {application.course_id?.title} <br />
              Submitted on {formatToYYYYMMDD(application?.SubmittedDate)}
            </p>
          </div>
        </div>
        {/* Send Message Button */}
        <button className="bg-button text-white px-4 py-2 rounded dark:text-white dark:bg-button-dark mt-4">
          Send Message
        </button>
      </div>

      {/* Personal Information */}
      <div className="bg-white p-6 rounded shadow mb-6 dark:text-white dark:bg-container-dark">
        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-500 mb-2 dark:text-white">Date Of Birth</label>
            <input
              type="text"
              value={formatToYYYYMMDD(studentInfo?.Dob)} // Access data
              className="w-full border rounded p-2 bg-gray-100 dark:bg-dark dark:text-white"
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-500 mb-2 dark:text-white">Phone</label>
            <input
              type="text"
              value={studentInfo?.PhoneNumber} // Access data
              className="w-full border rounded p-2 bg-gray-100 dark:bg-dark dark:text-white"
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-500 mb-2 dark:text-white">Email</label>
            <input
              type="email"
              value={studentInfo?.Email} // Access data
              className="w-full border rounded p-2 bg-gray-100 dark:bg-dark dark:text-white"
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-500 mb-2 dark:text-white">Address</label>
            <input
              value={`${studentInfo?.Address?.City || ""}, ${studentInfo?.Address?.Country || ""}`} // Safely access nested properties
              className="w-full border rounded p-2 bg-gray-100 dark:bg-dark dark:text-white"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Application Status */}
      <div className="bg-white p-6 rounded shadow mb-6 dark:bg-container-dark">
        <h2 className="text-lg font-semibold mb-4">Application Status</h2>
        <p
          className={`px-4 py-2 rounded text-white 
            ${status === "Accepted" ? "bg-green-600" :
              status === "Rejected" ? "bg-red-600" :
                "bg-gray-400"}`}
        >
          {status || "In Review"}
        </p>
      </div>

      {/* Documents */}
      <div className="bg-white p-6 rounded shadow mb-6 dark:bg-container-dark">
        <h2 className="text-lg font-semibold mb-4">Documents</h2>
        <div className="space-y-4">
          <iframe
            src={studentInfo?.Document}
            width="100%"
            height="600px"
            title="Document Viewer"
            aria-label="Document Viewer"
          ></iframe>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row justify-end md:space-x-4">
        <button
          className="bg-red-600 text-white px-4 py-2 my-2 md:my-0 rounded"
          onClick={() => handleStatusUpdate("Rejected")}
        >
          Reject
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 my-2 md:my-0 rounded"
          onClick={() => handleStatusUpdate("Accepted")}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default ApplicationDetails;
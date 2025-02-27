import React, { useState, useEffect, useMemo } from "react";
import { getApplicationById } from "../../services/applicationService";
import { useLocation } from "react-router-dom";
import { updateApplicationStatus } from "../../services/applicationService";

const ApplicationDetails = () => {
  const [application, setApplication] = useState(null);
  const [studentinfo, setStudentinfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const location = useLocation();
  const { id } = location.state || {}; // Get ID from state

  const formatToYYYYMMDD = useMemo(() => {
    return (dateString) => {
      if (!dateString) return ""; // Handle empty value
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
  }, []);
  useEffect(() => {
      if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, []);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        const response = await getApplicationById(id);
        setApplication(response.data.application);
        setStudentinfo(response.data.studentProfile);
        setStatus(response.data.application.Status);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplicationDetails();
    } else {
      setLoading(false);
      setError(new Error("No ID provided"));
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!application) return <div>Application not found.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded shadow mb-6 dark:bg-container-dark dark:text-white">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
            <img
              src={studentinfo?.ProfilePicture}
              alt="Profile"
              className="w-full h-full object-cover dark:bg-dark"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">
              {application?.userId?.name}'s Applications:
            </h1>
            <p className="text-gray-500 text-sm dark:text-white">
              Applied For: {application?.course_id?.title} <br />
              Submitted on {formatToYYYYMMDD(application?.SubmittedDate)}
            </p>
          </div>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded dark:bg-buttonDark">
          Send Message
        </button>
      </div>

      {/* Personal Information */}
      <div className="bg-white p-6 rounded shadow mb-6 dark:bg-container-dark dark:text-white">
        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Date Of Birth", value: formatToYYYYMMDD(studentinfo?.Dob) },
            { label: "Phone", value: studentinfo?.PhoneNumber },
            { label: "Email", value: studentinfo?.Email },
            {
              label: "Address",
              value: `${studentinfo?.Address?.City}, ${studentinfo?.Address?.Country}`,
            },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="block text-gray-500 mb-2 dark:text-white">{label}</label>
              <input
                type="text"
                value={value || ""}
                className="w-full border rounded p-2 bg-gray-100"
                disabled
              />
            </div>
          ))}
        </div>
      </div>

      {/* Application Status */}
      <div className="bg-white p-6 rounded shadow mb-6 dark:bg-container-dark dark:text-white">
        <h2 className="text-lg font-semibold mb-4">Application Status</h2>
        <p
          className={`px-4 py-2 rounded text-white ${
            status === "Accepted"
              ? "bg-green-600"
              : status === "Rejected"
              ? "bg-red-600"
              : "bg-gray-400 dark:bg-white dark:text-black"
          }`}
        >
          {status || "In Review"}
        </p>
      </div>

      {/* Documents */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Documents</h2>
        <div className="space-y-4">
          {studentinfo?.Document && (
            <iframe
              src={studentinfo?.Document}
              width="100%"
              height="600px"
              title="Document Viewer"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;

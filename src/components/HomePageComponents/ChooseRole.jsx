import React, { useState, useCallback } from "react";

function ChooseRole({ onBack, handleSubmit, formData }) {
  const [selectedRole, setSelectedRole] = useState("");

  // Memoize the role selection function to avoid unnecessary re-renders
  const handleRoleSelection = useCallback((role) => {
    setSelectedRole(role);
  }, []);

  // Data for each role
  const roleData = {
    Student: {
      image: "/images/StudentRole.png", // Replace with actual image URL or import
      description: "As a student, you'll have access to scholarships, courses, and more.",
      points: [
        "Access to multiple scholarships",
        "Track your application status",
        "Browse through courses and programs"
      ]
    },
    Institution: {
      image: "/images/InstitutionRole.png", // Replace with actual image URL or import
      description: "As an institution, you can manage and offer scholarships to students.",
      points: [
        "Create and manage scholarships",
        "Review student applications",
        "Engage with students and faculty"
      ]
    }
  };

  return (
    <div className="max-w-5xl w-full z-10 rounded-lg bg-white p-8 shadow-md mx-auto">
      <h2 className="mb-6 text-center text-2xl font-semibold">Choose Your Role</h2>

      {/* Role Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {["Student", "Institution"].map((role) => (
          <div
            key={role}
            className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedRole === role
                ? "border-purple-500 bg-purple-50"
                : "border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => handleRoleSelection(role)}
            role="button" // Accessibility improvement
            aria-label={`Select ${role} role`} // Accessibility improvement
          >
            <img
              src={roleData[role].image}
              alt={`${role} icon`}
              className="w-24 h-24 object-cover rounded-full mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">{role}</h3>
            <p className="text-center text-sm mb-4">{roleData[role].description}</p>
            <ul className="text-xs text-gray-700">
              {roleData[role].points.map((point, index) => (
                <li key={index} className="flex items-start mb-1">
                  <span className="mr-2">•</span> {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Button Section */}
      <div className="flex sm:flex-row flex-col sm:justify-between mt-4 space-y-4 sm:space-y-0">
        <button
          onClick={onBack}
          className="py-2 w-full sm:w-1/4 bg-gray-400 text-white rounded-md hover:bg-gray-500"
        >
          Back
        </button>
        <button
          onClick={() => handleSubmit({ ...formData, role: selectedRole })}
          disabled={!selectedRole}
          className={`py-2 w-full sm:w-1/4 rounded-md ${
            selectedRole
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default ChooseRole;

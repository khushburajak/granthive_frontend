import React, { useState, useEffect, useCallback } from "react";
import useAuth from "../../hooks/useAuth";
import { getCourseByInstitute, updateCourse } from "../../services/courseService";

const ScholarshipForm = () => {
  const { authState } = useAuth();
  const { role } = authState;

  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    scholarshipType: "flat", // Default type set to flat
    scholarshipAmount: "",
    scholarshipPercentage: "",
    eligibility_criteria: "",
    deadline: "",
  });

  const [errors, setErrors] = useState({
    courseId: "",
    scholarshipType: "",
    scholarshipAmount: "",
    scholarshipPercentage: "",
    eligibility_criteria: "",
    deadline: "",
  });

  // Set dark mode class on page load
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Fetch courses using useEffect only once
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await getCourseByInstitute();
        if (res.status !== 200) throw new Error("Failed to fetch courses");
        const formattedCourses = res.data.map(course => ({
          _id: course._id,
          title: course.title || "Default Course"
        }));
        setCourses(formattedCourses);
      } catch (err) {
        setError(`Error fetching courses: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const updatedData = { ...prevData, [name]: value };

      if (name === "courseId") {
        const selectedCourse = courses.find(course => course._id === value);
        updatedData.title = selectedCourse ? selectedCourse.title : "";
      }

      return updatedData;
    });

    setErrors(prevErrors => ({ ...prevErrors, [name]: "" })); // Reset errors for the field
  }, [courses]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.courseId) {
      isValid = false;
      newErrors.courseId = "Please select a course.";
    }
    if (!formData.scholarshipType) {
      isValid = false;
      newErrors.scholarshipType = "Please select a scholarship type.";
    }
    if (formData.scholarshipType === "flat" && !formData.scholarshipAmount) {
      isValid = false;
      newErrors.scholarshipAmount = "Please enter a scholarship amount.";
    }
    if (formData.scholarshipType === "percentage" && !formData.scholarshipPercentage) {
      isValid = false;
      newErrors.scholarshipPercentage = "Please enter a scholarship percentage.";
    }
    if (!formData.eligibility_criteria) {
      isValid = false;
      newErrors.eligibility_criteria = "Please enter eligibility criteria.";
    }
    if (!formData.deadline) {
      isValid = false;
      newErrors.deadline = "Please select a deadline.";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const dataToSend = {
      title: formData.title,
      scholarshipType: formData.scholarshipType,
      eligibility_criteria: formData.eligibility_criteria,
      deadline: formData.deadline,
      scholarshipAmount: formData.scholarshipType === "flat" ? formData.scholarshipAmount : formData.scholarshipPercentage,
    };

    try {
      const res = await updateCourse(formData.courseId, dataToSend);
      if (res.status === 200) {
        // Reset form data on successful submission
        setFormData({
          courseId: "",
          title: "",
          scholarshipType: "flat",
          scholarshipAmount: "",
          scholarshipPercentage: "",
          eligibility_criteria: "",
          deadline: "",
        });
        setErrors({});
        alert("Scholarship updated successfully!");
      } else {
        setError(res.data.message || "Error updating course.");
      }
    } catch (err) {
      setError(`Error submitting form: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-start h-screen p-8 bg-gradient-to-b from-purple-300 to-primary-500">
      <div className="max-w-lg w-full mx-auto bg-white p-8 shadow-lg rounded-md dark:bg-container-dark dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Scholarship Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Selection */}
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-white">
              Select a Course
            </label>
            <select
              id="course"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {courses.length > 0 ? (
                courses.map(course => (
                  <option key={course._id} value={course._id}>{course.title}</option>
                ))
              ) : (
                <option disabled>No courses available</option>
              )}
            </select>
            {errors.courseId && <p className="text-red-500 text-xs">{errors.courseId}</p>}
          </div>

          {/* Scholarship Type Selection */}
          <div>
            <label htmlFor="scholarship_type" className="block text-sm font-medium text-gray-700 dark:text-white">
              Select Scholarship Type
            </label>
            <select
              id="scholarship_type"
              name="scholarshipType"
              value={formData.scholarshipType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="flat">Flat</option>
              <option value="percentage">Percentage</option>
            </select>
            {errors.scholarshipType && <p className="text-red-500 text-xs">{errors.scholarshipType}</p>}
          </div>

          {/* Amount or Percentage */}
          {formData.scholarshipType === "flat" ? (
            <div>
              <label htmlFor="scholarshipAmount" className="block text-sm font-medium text-gray-700 dark:text-white">
                Scholarship Amount
              </label>
              <input
                type="number"
                id="scholarshipAmount"
                name="scholarshipAmount"
                value={formData.scholarshipAmount}
                onChange={handleChange}
                placeholder="Enter scholarship amount"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
              {errors.scholarshipAmount && <p className="text-red-500 text-xs">{errors.scholarshipAmount}</p>}
            </div>
          ) : (
            <div>
              <label htmlFor="scholarshipPercentage" className="block text-sm font-medium text-gray-700 dark:text-white">
                Scholarship Percentage
              </label>
              <input
                type="number"
                id="scholarshipPercentage"
                name="scholarshipPercentage"
                value={formData.scholarshipPercentage}
                onChange={handleChange}
                placeholder="Enter scholarship percentage"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
              {errors.scholarshipPercentage && <p className="text-red-500 text-xs">{errors.scholarshipPercentage}</p>}
            </div>
          )}

          {/* Eligibility Criteria */}
          <div>
            <label htmlFor="eligibility_criteria" className="block text-sm font-medium text-gray-700 dark:text-white">
              Eligibility Criteria
            </label>
            <textarea
              id="eligibility_criteria"
              name="eligibility_criteria"
              value={formData.eligibility_criteria}
              onChange={handleChange}
              placeholder="Enter eligibility criteria"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
            {errors.eligibility_criteria && <p className="text-red-500 text-xs">{errors.eligibility_criteria}</p>}
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-white">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
            {errors.deadline && <p className="text-red-500 text-xs">{errors.deadline}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 focus:outline-none dark:bg-buttonDark dark:text-white"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        {error && <p className="text-red-500 text-xs mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ScholarshipForm;

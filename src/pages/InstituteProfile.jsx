import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getInstituteProfilebyId } from "../services/instituteService";
import { getCoursesByInstituteId } from "../services/courseService";
import { createApplication, checkApplication } from "../services/applicationService";
import useAuth from "../hooks/useAuth";

const InstituteProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  const { authState } = useAuth();
  const { token, role } = authState;

  const [instituteInfo, setInstituteInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState({});
  const [openCourseIndex, setOpenCourseIndex] = useState(null);
  const courseSectionRef = useRef(null);

  // Fetch institute profile
  const fetchInstituteInfo = async () => {
    try {
      const response = await getInstituteProfilebyId(userId);
      if (response.status !== 200) throw new Error("Failed to fetch institute data.");
      const data = response.data.data;
      setInstituteInfo({
        name: data?.name || "Default Institute",
        location: `${data?.location?.city}, ${data?.location?.country}` || "Default Location",
        coverPhoto: data?.coverPhoto || "http://example.com/default-image.jpg",
        description: data?.description || "Default Description",
        university: data?.university || "Default University",
      });
    } catch (err) {
      setError(`Error fetching institute info: ${err.message}`);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await getCoursesByInstituteId(userId);
      if (res.status !== 200) throw new Error("Failed to fetch courses.");
      const coursesArray = await Promise.all(
        res.data.map(async (course) => {
          let applicationStatus = null;
          if (role === "Student") {
            const data = await checkApplication(course._id);
            applicationStatus = data.status;
          }
          return {
            id: course._id,
            title: course.title || "Default Course",
            description: course.description || "Default Description",
            scholarshipType: course.scholarshipType || "No Scholarship",
            scholarshipAmount: course.scholarshipAmount || "No Amount",
            deadline: course.deadline || "No Deadline",
            eligibility: course.eligibility_criteria || "No Eligibility",
            applicationStatus: applicationStatus,
          };
        })
      );
      setCourses(coursesArray);
    } catch (err) {
      setError(`Error fetching courses: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return; // Ensure userId exists before fetching data
    fetchInstituteInfo();
    fetchCourses();
  }, [userId]);

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const scrollToCourses = () => {
    if (courseSectionRef.current) {
      courseSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleDropdown = (index) => {
    setOpenCourseIndex(openCourseIndex === index ? null : index);
  };

  const handleApplyNow = async (courseId) => {
    try {
      const formData = { SubmittedDate: new Date().toISOString() };
      await createApplication(courseId, formData);
      setApplications((prev) => ({ ...prev, [courseId]: "Submitted" }));
      fetchCourses(); // Re-fetch to update application status
    } catch (err) {
      console.error("Error submitting application:", err);
    }
  };

  // Conditional rendering
  if (loading) return <p>Loading institute info...</p>;
  if (error) return <p>{error}</p>;
  if (!instituteInfo) return <p>No institute information available.</p>;

  return (
    <div className="max-w-screen shadow-lg rounded-lg overflow-hidden mx-auto lg:w-full dark:bg-background-dark">
      {/* Cover Photo */}
      <div className="relative">
        <img
          src={instituteInfo.coverPhoto}
          alt="College Cover"
          className="w-full h-64 object-cover sm:h-80 md:h-96 lg:h-64"
        />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 md:left-4 translate-y-1/2 md:-translate-x-0 bg-white p-3 rounded-xl dark:bg-background-dark">
          <div className="flex justify-center items-center w-20 h-20 bg-gray-100 rounded-xl border-black dark:bg-dark dark:text-white">
            <img
              src={instituteInfo.coverPhoto}
              alt="College Logo"
              className="h-16 w-16 object-contain"
            />
          </div>
        </div>
      </div>

      {/* College Name and Info */}
      <div className="bg-white p-6 pt-12 md:pt-2 flex flex-col sm:flex-row items-center justify-between dark:bg-background-dark dark:text-white">
        <div className="md:ml-24 text-center">
          <h1 className="text-2xl font-bold text-purple-800 dark:text-white">{instituteInfo.name}</h1>
          <p className="text-sm text-gray-600 dark:text-white">{instituteInfo.university}</p>
          <p className="text-sm text-gray-600 dark:text-white">{instituteInfo.location}</p>
        </div>
        <button
          className="mt-4 sm:mt-0 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 focus:outline-none dark:bg-buttonDark"
          onClick={scrollToCourses}
        >
          Apply Now
        </button>
      </div>

      {/* Overview Section */}
      <div className="p-6 bg-gray-100 rounded-lg mt-4 mx-5 dark:bg-container-dark">
        <h2 className="text-xl font-semibold text-purple-800 dark:text-white">Overview</h2>
        {instituteInfo.description.split("\n\n").map((paragraph, index) => (
          <p key={index} className="mt-2 text-gray-600 dark:text-gray-200">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Courses Section */}
      <section ref={courseSectionRef} id="course-section">
        <div className="flex flex-col gap-6 w-full bg-gray-100 p-6 mt-4 mx-5 rounded-lg dark:bg-container-dark">
          <h2 className="text-xl font-semibold text-purple-800 dark:text-white">Courses</h2>
          {loading ? (
            <p>Loading...</p>
          ) : courses.length > 0 ? (
            courses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                index={index}
                openCourseIndex={openCourseIndex}
                toggleDropdown={toggleDropdown}
                handleApplyNow={handleApplyNow}
                role={role}
                applications={applications}
              />
            ))
          ) : (
            <p>No courses available</p>
          )}
        </div>
      </section>
    </div>
  );
};

// Reusable Course Card Component
const CourseCard = ({
  course,
  index,
  openCourseIndex,
  toggleDropdown,
  handleApplyNow,
  role,
  applications,
}) => {
  return (
    <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg w-full hover:bg-gray-50 transition dark:bg-background-dark">
      {/* Course Title (Clickable to toggle dropdown) */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleDropdown(index)}
      >
        <h3 className="text-l text-gray-900 dark:text-white">{course.title}</h3>
        <span className="text-lg text-gray-600 dark:text-white">{openCourseIndex === index ? "▲" : "▼"}</span>
      </div>

      {/* Dropdown Content */}
      {openCourseIndex === index && (
        <div className="mt-4 text-gray-700 dark:text-white">
          <div className="mb-4">
            <p>{course.description}</p>
          </div>
          <div className="mb-4">
            <p className="font-medium text-l">Scholarship Type: {course.scholarshipType}</p>
          </div>
          {course.scholarshipType !== "No Scholarship" && (
            <div className="mt-4">
              <p>Amount: {course.scholarshipAmount}</p>
              <p>Deadline: {course.deadline}</p>
              <p>Eligibility: {course.eligibility}</p>
            </div>
          )}
          <button
            className={`px-4 py-2 rounded-lg shadow transition ${
              role === "Student" && applications[course.id] === "Submitted"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
            onClick={() => (role === "Student" && applications[course.id] !== "Submitted" ? handleApplyNow(course.id) : null)}
            disabled={role !== "Student" || applications[course.id] === "Submitted"}
          >
            {applications[course.id] === "Submitted" ? "Application Submitted" : "Apply Now"}
          </button>
        </div>
      )}
    </div>
  );
};

export default InstituteProfile;

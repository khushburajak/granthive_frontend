import React, { useEffect, useState } from "react";
import {
  getSingleInstituteProfile,
  updateInstituteProfile,
} from "../../services/instituteService";
import { createCourse, deleteCourse, updateCourse } from "../../services/courseService";
import { getCourseByInstitute } from "../../services/courseService";
import SaveChangesModel from "../models/SaveChangesModel";
import { MdEdit } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { uploadInstituteProfilePicture, uploadInstituteCoverPhoto } from "../../services/uploadService";
import { useNavigate } from "react-router-dom";


function InstituteProfileForm() {

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isChanged, setIsChanged] = useState(false); // Track changes
  // const [isCourseChanged, setIsCourseChanged] = useState(false);// Flag to track if there are any changes in the course
  const [showSavePopup, setShowSavePopup] = useState(false); // Control popup visibility

  const [instituteInfo, setInstituteInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCourseIndex, setOpenCourseIndex] = useState(null);  // State to manage which course's dropdown is open
  const [showCourseForm, setShowCourseForm] = useState(false);

  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    scholarshipType: '',
    scholarshipAmount: '',
    deadline: '',
    eligibility_criteria: ''
  });

  const [editValues, setEditValues] = useState({
    name: '',
    university: '',
    city: '',
    country: '',
  });
  const [originalValues, setOriginalValues] = useState({
    name: '',
    university: '',
    city: '',
    country: '',
    description: '',
  });

  const [overviewValue, setOverviewValue] = useState(instituteInfo?.description || '');

  // State for edited course
  const [editedCourse, setEditedCourse] = useState({
    title: "",
    description: "",
    scholarshipType: "",
    scholarshipAmount: "",
    deadline: "",
    eligibility_criteria: "",
  });
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues({
      ...editValues,
      [name]: value,
    });
    setNewCourse((prevState) => ({
      ...prevState,
      [name]: value
    }));
    checkIfChanged(); // Check if the form has been changed
  };

  // Update the edited course state when the user types in the input fields
  const handleCourseInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCourse((prev) => {
      const updated = { ...prev, [name]: value };
      console.log("Updated editedCourse:", updated); // Log the updated course state
      return updated;
    });
  };

  // Function to handle saving the updated course
  const handleSaveCourse = async (courseId) => {
    try {
      console.log("edited course before update:", editedCourse);
      const updatedCourse = await updateCourse(courseId, editedCourse);

      if (updatedCourse.status === 200) {
        console.log("Course updated successfully:", updatedCourse.data);
        setIsEditingCourse(false); // Exit edit mode after save
        setEditedCourse({}); // Reset the edited course data
      }
      fetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleEditCourse = (course) => {
    setIsEditingCourse(true); // Enable edit mode
    setEditedCourse(course); // Load course data into state 
  };

  // Handle canceling the edit and revert changes
  const handleCancelEdit = () => {
    setIsEditingCourse(false); // Disable editing mode
    setEditedCourse(null); // Reset the edited course data
  };

  // Check if any changes are made
  const checkIfChanged = () => {
    setIsChanged(
      editValues.name !== originalValues.name ||
      editValues.university !== originalValues.university ||
      editValues.city !== originalValues.city ||
      editValues.country !== originalValues.country ||
      overviewValue !== originalValues.description
    );
    setShowSavePopup(true); // Show popup when changes are detected
  };

  // Toggle editing mode
  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  // Handle change in the overview input field
  const handleOverviewInputChange = (event) => {
    setOverviewValue(event.target.value);
    checkIfChanged(); // Check if the form has been changed
  };

  // Toggle editing mode for the overview section
  const handleOverviewEditClick = () => {
    setIsEditingOverview((prev) => !prev);
  };

  // Toggle the dropdown and prevent it from closing if in editing mode
  const toggleDropdown = (index) => {
    if (!isEditingCourse) {
      setOpenCourseIndex(openCourseIndex === index ? null : index);
    }
  };

  const handleCoverPhotoEdit = () => {
    document.getElementById("coverPhoto").click(); // Triggers the hidden file input for cover photo
  };

  const handleProfilePictureEdit = () => {
    document.getElementById("profilePicture").click(); // Triggers the hidden file input for profile picture
  };


  const handleProfilePictureChange = (e) => {
    const image = e.target.files[0];
    if (image) {
      setProfilePicture(image);  // Set selected file to state
    }
  };

  //handle profile picture upload
  const handleProfilePictureUpload = async (e) => {
    e.preventDefault();

    if (!profilePicture) {
      setError("Please select a image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profilePicture", profilePicture);
      console.log(profilePicture);
      const data = await uploadInstituteProfilePicture(formData);  // Use the function from fileUpload.js
      console.log("Upload Response:", data);  // Log the response for debugging
      if (!data) {
        setError("Failed to save profile");
        return;
      }
      alert("Profile Picture updated successfully!");
      setError(null);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setError("Error uploading profile picture.");
    }
  };

  const handleCoverPhotoChange = (e) => {
    const image = e.target.files[0];
    if (image) {
      setCoverPhoto(image);  // Set selected file to state
    }
  };

  //handle profile picture upload
  const handleCoverPhotoUpload = async (e) => {
    e.preventDefault();

    if (!coverPhoto) {
      setError("Please select a image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("coverPhoto", coverPhoto);
      console.log(coverPhoto);
      const data = await uploadInstituteCoverPhoto(formData);  // Use the function from fileUpload.js
      console.log("Upload Response:", data);  // Log the response for debugging
      if (!data) {
        setError("Failed to save profile");
        return;
      }
      alert("Cover Photo updated successfully!");
      setError(null);
    } catch (error) {
      console.error("Error uploading cover photo:", error);
      setError("Error uploading cover photo.");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await deleteCourse(courseId);
      console.log("Response status:", response.status); // Check the response status
      if (response.status == 200) {
        console.log("Course deleted successfully:", response.data);
        setCourses(courses.filter(course => course._id !== courseId));
      } else {
        console.error('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };


  // You can verify this by logging the current state in the parent component
  console.log("showSavePopup state:", showSavePopup);

  //For course submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("New Course Data:", newCourse);
    try {
      const response = await createCourse(newCourse);
      console.log("Response status:", response.status); // Check the response status
      console.log("Response data:", response.data); // Check the response data
      if (response.status === 201) {
        const addedCourse = response.data;
        // Handle success (reset form data, etc.)
        console.log("Course added successfully:", addedCourse);
        setCourses((prevCourses) => [...prevCourses, addedCourse]); // Update courses state
        setNewCourse({
          title: '',
          description: '',
          scholarshipType: '',
          scholarshipAmount: '',
          deadline: '',
          eligibility_criteria: ''
        });
        setShowCourseForm(false);
        fetchCourses();
      } else {
        console.error('Failed to add course');
      }
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  //institute info submit
  const handleSubmit = async (e) => {
    // e.preventDefault();


    // Prepare the data to send
    const dataToSend = {
      name: editValues.name,
      university: editValues.university,
      description: overviewValue,
      location: {
        city: editValues.city,
        country: editValues.country,
      }
    };

    console.log("Data to send to backend:", dataToSend);


    try {
      const res = await updateInstituteProfile(dataToSend); // Passing the courseId (title) to the backend 
      if (res.status === 200) {
        // Handle success (reset form data, etc.)
        console.log("Institute updated successfully:", res.data);
        // After saving, reset the original values
        setOriginalValues({
          name: editValues.name,
          university: editValues.university,
          city: editValues.city,
          country: editValues.country,
          description: overviewValue,
        });
        setShowSavePopup(false);
      } else {
        console.log("Error updating institute info:", res.data.message);
      }
      const updatedInstitute = await res;
      console.log('Updated Institute:', updatedInstitute);
      fetchInstituteInfo();
    } catch (error) {
      console.log("Error updating institute:", error);
    }
  };

  const fetchInstituteInfo = async () => {
    try {

      const response = await getSingleInstituteProfile();
      if (!(response.status === 200)) {
        throw new Error("Network response was not ok");
      }
      const data = await response.data;
      console.log(`Institute Info`, data);
      // Extract name, location with defaults
      const name = data.data?.name || "Default Institute";
      const location = data.data?.location.city + ", " + data.data?.location.country || "Default Location";
      const description = data.data?.description || "Default Description";
      const university = data.data?.university || "Default University";
      const coverPhoto = data.data?.coverPhoto || "";
      const profilePhoto = data.data?.profilePhoto || "";
      console.log("location:", location);
      setInstituteInfo({ name, location, description, university, coverPhoto, profilePhoto });
    } catch (err) {
      setError(`Error fetching institute info: ${err.message}`);
      navigate("/Institution/instituteprofile/create");
    } finally {
      setLoading(false);
    }
    // console.log("Institute Info hereee:", instituteInfo);
  };

  const fetchCourses = async () => {
    try {
      const res = await getCourseByInstitute();

      if (!(res.status === 200)) {
        throw new Error("Network response was not ok");
      }
      const allCourses = await res.data;
      console.log(`Fetched Course Info`, allCourses);
      // Extracting an array of course id and title
      const formattedCourses = allCourses.map(course => ({
        _id: course._id,
        title: course.title || "Default Course", // Default fallback in case no title
        description: course.description || "Default Description", // Extract first item from description array
        scholarshipType: course.scholarshipType || "No Scholarship",
        scholarshipAmount: course.scholarshipAmount || "No Amount",
        deadline: course.deadline || "No Deadline",
        eligibility_criteria: course.eligibility_criteria || "No Eligibility",
      }));
      setCourses(formattedCourses);
    } catch (err) {
      setError(`Error fetching courses: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchInstituteInfo();
    fetchCourses();
  }, []);

  // Effect to update editValues when instituteInfo is available
  useEffect(() => {
    if (instituteInfo) {
      const location = instituteInfo.location || '';
      // If location is a string (e.g., 'Kathmandu, Nepal'), split it
      if (typeof location === 'string') {
        const [city, country] = location.split(',').map(part => part.trim());
        setEditValues({
          name: instituteInfo.name || '',
          university: instituteInfo.university || '',
          city: city || '',
          country: country || '',
        });
        setOriginalValues({
          name: instituteInfo.name || '',
          university: instituteInfo.university || '',
          city: city || '',
          country: country || '',
          description: instituteInfo.description || '',
        });
      } else {
        setEditValues({
          name: instituteInfo.name || '',
          university: instituteInfo.university || '',
          city: instituteInfo?.location.city || '',
          country: instituteInfo.location?.country || '',
        });
        setOriginalValues({
          name: instituteInfo.name || '',
          university: instituteInfo.university || '',
          city: instituteInfo.location?.city || '',
          country: instituteInfo.location?.country || '',
          description: instituteInfo.description || '',
        });
      }
      console.log("Edit Values:", editValues);
      setOverviewValue(instituteInfo.description || '');
    }
  }, [instituteInfo]); // This effect will run whenever `instituteInfo` changes

  useEffect(() => {
    if (isEditingCourse && editedCourse) {
      console.log("Course is being edited:", editedCourse);
    }
  }, [editedCourse]); // This will run whenever `editedCourse` changes.

  const courseSectionRef = React.useRef(null);
  const scrollToCourses = () => {
    if (courseSectionRef.current) {
      courseSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return <p>Loading institute info...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!instituteInfo) {
    return <p>No institute information available.</p>;
  }

  return (
    <div
      className={`min-h-screen shadow-lg rounded-lg overflow-hidden justify-center bg-gray-50 relative  dark:bg-background-dark`}
    >
      {/* Cover Photo */}
      <div className="relative">
        <img
          src={
            coverPhoto
              ? URL.createObjectURL(coverPhoto)
              : instituteInfo.coverPhoto
          }
          alt="College Cover"
          className="w-full h-64 object-cover"
        />
        {/* Pencil Icon for Cover Photo */}
        <div className="absolute top-2 right-4 bg-white p-2 rounded-full shadow-lg cursor-pointer opacity-50 hover:opacity-100 dark:bg-darke">
          <MdEdit onClick={() => handleCoverPhotoEdit()} className="text-gray-600 hover:text-purple-500 cursor-pointer"
            style={{ fontSize: '24px' }} />

        </div>
        <div >
          {coverPhoto && (
            <button className="absolute bottom-2 right-4 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300"
              onClick={handleCoverPhotoUpload}
            >Save</button>
          )}

        </div>

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 md:left-4 translate-y-1/2 md:-translate-x-0 bg-white p-3 rounded-xl dark:bg-background-dark">
          {/* College Logo */}
          <div className="flex justify-center items-center w-20 h-20 bg-gray-100 rounded-xl border-black dark:bg-dark dark:text-white ">
            <img
              src={
                profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : instituteInfo.profilePhoto
              }
              alt="College Logo"
              className="h-16 w-16 object-contain"
            />
          </div>
          {/* Pencil Icon for Profile Picture */}
          <div className="absolute top-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer opacity-50 hover:opacity-100  dark:bg-darke dark:text-white">
            <MdEdit onClick={() => handleProfilePictureEdit()} className="text-gray-600 hover:text-purple-500 cursor-pointer  "
              style={{ fontSize: '24px' }} />
          </div>
          {/* Save Button (Only shows when pfploading is true) */}
          {profilePicture && (
            <button
              onClick={handleProfilePictureUpload}
              className="mt-2 w-20 bg-purple-500 text-white font-semibold py-1 px-2 rounded-lg shadow-md hover:bg-purple-600 transition duration-200 ease-in-out "
            >
              Save
            </button>
          )}
        </div>
      </div>
      {/* Hidden File Inputs for Image Upload */}
      <input type="file" id="coverPhoto" className="hidden" accept="image/*" onChange={handleCoverPhotoChange} />
      <input type="file" id="profilePicture" className="hidden" accept="image/*" onChange={handleProfilePictureChange} />

      {/* College Name and Info */}
      <div className="bg-white p-6 pt-12 md:pt-2 flex flex-col sm:flex-row items-center justify-between dark:bg-background-dark dark:text-white">
  <div className="md:ml-24 text-center md:text-left">
    <div>
      {/* Editable Mode */}
      {isEditing ? (
        <div>
          <input
            type="text"
            name="name"
            value={editValues.name}
            onChange={handleInputChange}
            className="text-2xl font-bold text-purple-800 border-b border-gray-300 p-1 dark:bg-background-dark dark:text-white"
          />
          <input
            type="text"
            name="university"
            value={editValues.university}
            onChange={handleInputChange}
            className="text-sm text-gray-600 border-b border-gray-300 p-1 mt-2 dark:bg-background-dark dark:text-white"
          />
          {/* Location: Separate inputs for city and country */}
          <div className="mt-2 flex space-x-2">
            <input
              type="text"
              name="city"
              value={editValues.city}
              onChange={handleInputChange}
              placeholder="City"
              className="text-sm text-gray-600 border-b border-gray-300 p-1 dark:bg-background-dark dark:text-white"
            />
            <input
              type="text"
              name="country"
              value={editValues.country}
              onChange={handleInputChange}
              placeholder="Country"
              className="text-sm text-gray-600 border-b border-gray-300 p-1 dark:bg-background-dark dark:text-white"
            />
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-purple-800 dark:text-white">{originalValues.name}</h1>
          <p className="text-sm text-gray-600 dark:text-white">{originalValues.university}</p>
          <p className="text-sm text-gray-600 dark:text-white">{originalValues.city && originalValues.country
            ? `${originalValues.city}, ${originalValues.country}`
            : 'Location not set'}</p>
        </div>
      )}
    </div>
  </div>

  {/* Flex container for the edit icon and the button */}
  <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mt-4 sm:mt-0">
    {/* MdEdit Icon Button */}
    <MdEdit
      onClick={handleEditClick}
      className="text-gray-600 cursor-pointer hover:text-purple-700"
    />
    
    {/* Apply Now Button */}
    <button
      className="mt-4 sm:mt-0 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 focus:outline-none dark:bg-buttonDark"
      onClick={scrollToCourses}
    >
      Apply Now
    </button>
  </div>
</div>

      {/* Overview Section*/}
      <div className="p-6 bg-gray-100 rounded-lg mt-4  dark:bg-container-dark mx-5">
        <h2 className="text-xl font-semibold text-purple-800 flex items-center justify-between  dark:text-white">Overview
          {/* MdEdit Icon Button for Overview */}
          <div className="mt-2"  >
            <MdEdit
              onClick={handleOverviewEditClick}
              className="text-gray-600 cursor-pointer hover:text-purple-700   "
            />
          </div>
        </h2>

        {/* Editable Mode for Overview */}
        {isEditingOverview ? (
          <textarea
            value={overviewValue}
            onChange={handleOverviewInputChange}
            className="mt-2 p-2 w-full text-sm text-gray-600 border-b border-gray-300 dark:text-white dark:bg-background-dark"
          />
        ) : (
          originalValues.description.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mt-2 text-gray-600 dark:text-white ">
              {paragraph}
            </p>
          ))
        )}
      </div>

      {/*Courses Section*/}
      <section ref={courseSectionRef} id="course-section">
  <div className="flex flex-col gap-6 bg-gray-100 p-6 mt-4 rounded-lg dark:bg-container-dark text-white mx-5">
  <h2 className="text-xl font-semibold text-purple-800 dark:text-white flex items-center justify-between">
  Courses
  <FiPlus 
    className="text-gray-600 cursor-pointer hover:text-purple-700" 
    onClick={() => setShowCourseForm(true)} 
  />
</h2>

    {loading ? (
      <p>Loading...</p>
    ) : Array.isArray(courses) && courses.length > 0 ? (
      courses.map((course, index) => {
        return (
          <div
            key={index}
            className="flex flex-col bg-white p-6 rounded-lg shadow-lg w-full hover:bg-gray-50 transition transform hover:scale-105 dark:bg-background-dark dark:text-white"
          >
            {/* Course Title (Clickable to toggle dropdown) */}
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleDropdown(index)}
            >
              {/* Editable Course Title */}
              {openCourseIndex === index && isEditingCourse && editedCourse && editedCourse._id === course._id ? (
                <input
                  type="text"
                  name="title"
                  value={editedCourse.title}
                  onChange={handleCourseInputChange}
                  className="text-lg text-gray-900 border-b border-gray-300 p-1 dark:bg-background-dark dark:text-white"
                />
              ) : (
                <h3 className="text-lg text-gray-900 dark:text-white">{course.title}</h3>
              )}

              <div className="flex justify-between items-center cursor-pointer">
                {/* Pencil Icon to Enable Edit Mode */}
                {openCourseIndex === index && !isEditingCourse && (
                  <MdEdit
                    className="text-gray-600 cursor-pointer mr-2 dark:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCourse(course);
                    }}
                  />
                )}

                {/* Delete Icon */}
                <MdDelete
                  className="text-red-600 cursor-pointer mr-2"
                  onClick={() => handleDeleteCourse(course._id)}
                />

                {/* Icon to indicate dropdown */}
                <span className="text-lg text-gray-600 dark:text-white">
                  {openCourseIndex === index ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {/* Dropdown Content */}
            {openCourseIndex === index && (
              <div className="mt-4 text-gray-700 dark:text-white">
                {/* Editable Description */}
                {isEditingCourse && editedCourse && editedCourse._id === course._id ? (
                  <textarea
                    name="description"
                    value={editedCourse.description}
                    onChange={handleCourseInputChange}
                    className="w-full p-2 border border-gray-300 rounded dark:bg-background-dark dark:text-white"
                  />
                ) : (
                  <p>{course.description || 'No description available'}</p>
                )}
                {/* Editable Scholarship Type */}
                {isEditingCourse && editedCourse && editedCourse._id === course._id ? (
                  <select
                    name="scholarshipType"
                    value={editedCourse.scholarshipType}
                    onChange={handleCourseInputChange}
                    className="w-full p-2 border border-gray-300 rounded dark:bg-background-dark dark:text-white"
                  >
                    <option value="" disabled>
                      {editedCourse.scholarshipType || "Select scholarship type"}
                    </option>
                    <option value="flat">Flat</option>
                    <option value="percentage">Percentage</option>
                  </select>
                ) : (
                  <p className="font-medium text-l">Scholarship Type: {course.scholarshipType}</p>
                )}

                {/* Editable Scholarship Amount */}
                {isEditingCourse && editedCourse && editedCourse._id === course._id ? (
                  <input
                    type="text"
                    name="scholarshipAmount"
                    value={editedCourse.scholarshipAmount}
                    onChange={handleCourseInputChange}
                    className="w-full p-2 border border-gray-300 rounded dark:bg-background-dark dark:text-white"
                    placeholder="Scholarship Amount"
                  />
                ) : (
                  <p className="font-medium">Scholarship Amount: {course.scholarshipAmount}</p>
                )}

                {/* Editable Deadline */}
                {isEditingCourse && editedCourse && editedCourse._id === course._id ? (
                  <input
                    type="date"
                    name="deadline"
                    value={editedCourse.deadline}
                    onChange={handleCourseInputChange}
                    className="w-full p-2 border border-gray-300 rounded dark:bg-background-dark dark:text-white"
                  />
                ) : (
                  <p className="font-medium">Deadline: {course.deadline}</p>
                )}

                {/* Editable Eligibility Criteria */}
                {isEditingCourse && editedCourse && editedCourse._id === course._id ? (
                  <input
                    type="text"
                    name="eligibility_criteria"
                    value={editedCourse.eligibility_criteria}
                    onChange={handleCourseInputChange}
                    className="w-full p-2 border border-gray-300 rounded dark:bg-background-dark dark:text-white"
                    placeholder="Eligibility Criteria"
                  />
                ) : (
                  <p className="font-medium">Eligibility Criteria: {course.eligibility_criteria}</p>
                )}

                {/* Save and Cancel buttons if the course is being edited */}
                {isEditingCourse && editedCourse && editedCourse._id === course._id && (
                  <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4">
                    <button
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 dark:bg-buttonDark dark:text-white"
                      onClick={() => handleSaveCourse(course._id)} // Save changes
                    >
                      Save Changes
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-300 text-black rounded-lg shadow hover:bg-gray-400 dark:bg-buttonDark dark:text-white"
                      onClick={handleCancelEdit} // Cancel the edit
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })
    ) : (
      <p>No courses available</p>
    )}
  </div>

  {/* Add Course Form */}
  {showCourseForm && (
    <form
      onSubmit={handleFormSubmit}
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3 text-center dark:bg-dark dark:text-white">
        <h3 className="text-xl font-semibold mb-4">Add New Course</h3>
        <div className="mb-4">
          <input
            type="text"
            name="title"
            value={newCourse.title}
            onChange={handleInputChange}
            placeholder="Course Title"
            className="w-full p-2 border border-gray-300 rounded dark:bg-background-dark dark:text-white"
          />
        </div>
        <div className="mb-4 text-white">
          <textarea
            name="description"
            value={newCourse.description}
            onChange={handleInputChange}
            placeholder="Course Description"
            className="w-full p-2 border border-gray-300 rounded dark:bg-background-dark dark:text-white"
          />
        </div>
        <div className="mb-4">
          <select
            id="scholarship_type"
            name="scholarshipType"
            value={newCourse.scholarshipType}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 text-gray rounded dark:bg-background-dark dark:text-white"
            defaultValue=""
          >
            <option value="" disabled>Select an option</option>
            <option value="Flat">Flat</option>
            <option value="Percentage">Percentage</option>
          </select>
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="scholarshipAmount"
            value={newCourse.scholarshipAmount}
            onChange={handleInputChange}
            placeholder="Scholarship Amount"
            className="w-full p-2 border border-gray-300 rounded dark:bg-background-dark dark:text-white"
          />
        </div>
        <div className="mb-4">
          <input
            type="date"
            name="deadline"
            value={newCourse.deadline}
            onChange={handleInputChange}
            placeholder="Deadline"
            className="w-full p-2 border border-gray-300 rounded dark:bg-background-dark dark:text-white"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="eligibility_criteria"
            value={newCourse.eligibility_criteria}
            onChange={handleInputChange}
            placeholder="Eligibility Criteria"
            className="w-full p-2 border border-gray-300 rounded dark:bg-background-dark dark:text-white"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 dark:bg-buttonDark dark:text-white"
          >
            Add Course
          </button>
          <button
            type="button"
            onClick={() => setShowCourseForm(false)}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg shadow hover:bg-gray-400 dark:bg-buttonDark dark:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )}
</section>

      {/* Show the Save Changes Modal */}
      {showSavePopup && (
        <SaveChangesModel
          isChanged={isChanged}
          onSave={handleSubmit} // Pass the save function as a prop
          setShowSavePopup={setShowSavePopup}
        />)}
    </div>
  );
}

export default InstituteProfileForm;

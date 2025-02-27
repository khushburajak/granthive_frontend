import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//studentServices
import { getProfile, updateProfile } from "../../services/studentService";
//uploadService
import { uploadStudentProfilePicture, uploadStudentDocument } from "../../services/uploadService";

const Profile = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profileData, setProfileData] = useState({
    StudentName: "",
    Dob: "",
    PhoneNumber: "",
    Address: { City: "", Country: "" },
  });


  const [error, setError] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Fetch profile data from the backend
  useEffect(() => {
    const fetchProfileData = async () => {
      setError(null);

      try {
        const response = await getProfile();
        const user = response?.data.user;
        const data = response?.data.studentProfile;
        console.log("data", user);
        if (!data) {
          setError("something went wrong");
          return;
        }
        setProfileData({
          userName: user.name,
          email: user.email,
          StudentName: data.StudentName || "",
          Dob: formatToYYYYMMDD(data.Dob) || "",
          PhoneNumber: data.PhoneNumber || "",
          Address: {
            City: data.Address?.City || "",
            Country: data.Address?.Country || "",
          },
          profilePicture: data.ProfilePicture || "",
          document: data.Document || "",
        });


        setError(null);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        navigate("/Student/studentprofile/create");
        setError(error.response);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setProfileData((prevState) => ({
      ...prevState,
      [name]: name === "Dob" ? formatToYYYYMMDD(value) : value, // Format date
      Address:
        name === "City" || name === "Country"
          ? { ...prevState.Address, [name]: value }
          : prevState.Address,
    }));
  };

  const formatToYYYYMMDD = (dateString) => {
    if (!dateString) return ""; // Handle empty value
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  //handle image change
  const handlePhotoChange = (e) => {
    const image = e.target.files[0];
    if (image) {
      setProfilePicture(image);  // Set selected file to state
    }
  };

  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("Image to upload: ", file.name); // Replace with actual upload logic
    }
  };

  //handle image upload
  const handleImageUpload = async () => {
    if (!profilePicture) {
      setError("Please select a image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profilePicture", profilePicture);
      console.log(profilePicture);
      const data = await uploadStudentProfilePicture(formData);  // Use the function from fileUpload.js
      console.log(data);
      if (!data) {
        setError("Failed to save profile");
        return;
      }
      alert("Profile Picture updated successfully!");
      setError(null);
    } catch (error) {
      setError("Error uploading profile picture.");
    }
  };

  //handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("document", selectedFile);
      console.log(selectedFile);
      const data = await uploadStudentDocument(formData);  // Use the function from fileUpload.js
      console.log(data);
      if (!data) {
        setError("Failed to save profile");
        return;
      }
      alert("Document updated successfully!");
      setError(null);
    } catch (error) {
      setError("Error uploading Document.");
    }
  };

  console.log(profileData);

  // Save profile data to the backend
  const handleSave = async () => {
    setError(null);
    try {
      const formData = {
        ...profileData,

        Image: selectedFile,
      };
      console.log(formData);

      const response = await updateProfile(formData);
      const data = response?.data;
      console.log(data);
      if (!data) {
        setError("Failed to save profile");
        return;
      }
      alert("Profile saved successfully!");
      setError(null);
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.error("Error saving profile data:", msg);
      setError(msg);
    }
  };


  return (
    <div className="min-h-screen p-0 dark:bg-background-dark">
      <div className="min-h-screen p-10 w-full">
        {/* Header */}
        <header className="mb-6 ">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 justify-self-center lg:justify-self-start">
            Profile
          </h1>
        </header>

        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-800">
            <img
              src={
                profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : profileData.profilePicture
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4">
            <p className="font-bold dark:text-gray-200">{profileData.userName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">{profileData.email}</p>

          </div>

        </div>

        <label className="mb-4 px-4 py-2 bg-button text-white rounded-md hover:bg-button-hover dark:bg-button-dark dark:text-black dark:hover:bg-button-darkhover dark:hover:text-white shadow-sm cursor-pointer inline-block">
          Upload Photo
          <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
        </label>

        {profilePicture && (
          <div className="inline-flex items-center space-x-4">
            <button
              onClick={handleImageUpload}
              className="mx-5 mb-4 px-4 py-2 bg-button text-white rounded-md hover:bg-button-hover dark:bg-button-dark dark:text-black dark:hover:bg-button-darkhover dark:hover:text-white shadow-sm cursor-pointer inline-block"
            >
              Save
            </button>
          </div>
        )}
        {profilePicture && (
          <p className="text-sm text-green-500">
            File selected: {profilePicture.name}
          </p>
        )}

        <div>
          <h2 className="font-bold mb-2 mt-2 dark:text-white">Personal Information</h2>
          <div className="bg-white shadow-md p-6 rounded-lg border border-gray-200 dark:bg-container-dark dark:border-gray-700 grid grid-cols-2 gap-4 mb-6 dark:bg-container-dark">
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="StudentName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </label>
              <input
                type="text"
                id="StudentName"
                name="StudentName"
                placeholder="Full Name"
                value={profileData.StudentName}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 w-full mt-1 dark:bg-background-dark dark:text-gray-200"
              />
            </div>

            {/* Date of Birth Field */}
            <div>
              <label
                htmlFor="Dob"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="Dob"
                name="Dob"
                placeholder="Date of Birth"
                value={profileData.Dob}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 w-full mt-1 dark:bg-background-dark dark:text-gray-200"
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label
                htmlFor="PhoneNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone Number
              </label>
              <input
                type="number"
                id="PhoneNumber"
                name="PhoneNumber"
                placeholder="Phone Number"
                value={profileData.PhoneNumber}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 w-full mt-1 dark:bg-background-dark dark:text-gray-200"
              />
            </div>

            {/* City Field */}
            <div>
              <label
                htmlFor="City"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                City
              </label>
              <input
                type="text"
                id="City"
                name="City"
                placeholder="City"
                value={profileData.Address.City || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 w-full mt-1 dark:bg-background-dark dark:text-gray-200"
              />
            </div>

            {/* Country Field */}
            <div>
              <label
                htmlFor="Country"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Country
              </label>
              <input
                type="text"
                id="Country"
                name="Country"
                placeholder="Country"
                value={profileData.Address.Country || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 w-full mt-1 dark:bg-background-dark dark:text-gray-200"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-2 dark:text-white">Academic Information</h2>

          <div className="mb-6">
            <div className="bg-white shadow-md p-6 rounded-lg border border-gray-200 dark:bg-container-dark dark:border-gray-700">
              <h3 className="font-semibold text-xl mb-4 text-gray-800 dark:text-gray-100">Documents</h3>
              <h2 className="text-gray-600 text-base mb-3 dark:text-gray-300">Upload a PDF including the following documents in the given order:</h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm mb-4">
                <li>Citizenship</li>
                <li>Marksheet in descending order</li>
                <li>Transcript in descending order</li>
              </ul>

              <div className="space-y-3 mb-6">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-300 dark:bg-background-dark dark:text-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-300">Only PDF files are allowed.</p>

                {/* Only show Update button if a file is selected */}
                {selectedFile && (
                  <button
                    onClick={handleFileUpload}
                    className="text-blue-500 hover:text-blue-700 text-sm mt-3"
                  >
                    Update
                  </button>
                )}
                <div>
                  <iframe
                    src={selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : profileData.document
                    }
                    width="100%"
                    height="600px"
                    title="Document Viewer"
                  ></iframe>
                </div>
              </div>

            </div>
          </div>


        </div>

        {/* Save Button */}
        <div className="text-right mt-6">
          <button
            className="mb-4 px-4 py-2 bg-button text-white rounded-md hover:bg-button-hover dark:bg-button-dark dark:text-black dark:hover:bg-button-darkhover dark:hover:text-white shadow-sm cursor-pointer inline-block"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createStudentProfile } from "../../services/studentService";
import { uploadStudentProfilePicture, uploadStudentDocument } from "../../services/uploadService";

const StudentProfileForm = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    city: "",
    country: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle file change for document upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  // Handle image change for profile picture upload
  const handleImageChange = (e) => {
    const image = e.target.files[0];
    if (image) setSelectedImage(image);
  };

  // Validate the form
  const validateForm = useCallback(() => {
    if (!selectedImage) return "Please select a profile picture.";
    if (!selectedFile) return "Please select a document.";
    return "";
  }, [selectedImage, selectedFile]);

  // Handle document upload
  const handleFileUpload = useCallback(async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("document", selectedFile);
    try {
      const response = await uploadStudentDocument(formData);
      if (response) console.log("Document uploaded successfully!");
    } catch (error) {
      console.error("Error uploading document", error);
    }
  }, [selectedFile]);

  // Handle image upload
  const handleImageUpload = useCallback(async () => {
    if (!selectedImage) return null;
    const formData = new FormData();
    formData.append("profilePicture", selectedImage);
    try {
      const response = await uploadStudentProfilePicture(formData);
      return response.data?.imageUrl;
    } catch (error) {
      console.error("Error uploading profile picture", error);
      return null;
    }
  }, [selectedImage]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const profileData = {
        StudentName: formData.name,
        Address: {
          City: formData.city,
          Country: formData.country,
        },
        Email: formData.email,
        PhoneNumber: formData.phone,
        Dob: formData.dob,
      };

      const response = await createStudentProfile(profileData);

      // Handle image and document upload after profile creation
      const imageUrl = await handleImageUpload();
      await handleFileUpload();

      if (response.data) {
        console.log("Profile created successfully");
        alert("Student profile created successfully!");
        navigate("/student/dashboard");
      } else {
        setError("Failed to create profile.");
      }
    } catch (error) {
      setError("An error occurred while creating your profile.");
      console.error("Error creating profile:", error);
    }
  }, [formData, handleImageUpload, handleFileUpload, validateForm, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-300 to-primary-500">
      <div className="max-w-2xl mx-auto p-5">
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-md">
          <div className="flex flex-col justify-center items-center mb-5">
            <h2 className="text-center text-gray-600 text-2xl mb-4">Create your Student Profile</h2>
            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden  mb-4">
              <img
                src={selectedImage ? URL.createObjectURL(selectedImage) : "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100 cursor-pointer inline-block">
              Upload Photo
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          {/* Input fields */}
          {['name', 'email', 'phone', 'dob', 'city', 'country'].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === 'dob' ? 'date' : field === 'email' ? 'email' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-gray-700">Documents</label>
            <h2 className="text-gray-800 text-lg mb-3">Upload a pdf including the following documents in the given order:</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Citizenship</li>
              <li>Marksheet in descending order.</li>
              <li>Transcript in descending order.</li>
            </ul>
            <input
              type="file"
              name="document"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-button text-white py-2 rounded-md hover:bg-purple-700 transition focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfileForm;

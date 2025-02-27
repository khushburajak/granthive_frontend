import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createInstituteProfile } from "../../services/instituteService";
import { uploadInstituteProfilePicture, uploadInstituteCoverPhoto } from "../../services/uploadService";

const InstituteProfileCreationForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    phone: "",
    city: "",
    country: "",
    description: "",
    profilePicture: null,
    coverPhoto: null,
    galleryPhotos: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "profilePicture" || name === "coverPhoto") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0], // Handle single file upload
      }));
    } else if (name === "galleryPhotos") {
      setFormData((prev) => ({
        ...prev,
        galleryPhotos: [...prev.galleryPhotos, ...files], // Handle multiple file uploads
      }));
    }
  };

  const handleRemovePhoto = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      galleryPhotos: prev.galleryPhotos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const validateForm = () => {
    if (!formData.profilePicture || !formData.coverPhoto) {
      setError("Please select both profile and cover photos.");
      return false;
    }
    return true;
  };

  const handleProfilePictureUpload = async () => {
    const formData = new FormData();
    formData.append("profilePicture", formData.profilePicture);
    return await uploadInstituteProfilePicture(formData);
  };

  const handleCoverPhotoUpload = async () => {
    const formData = new FormData();
    formData.append("coverPhoto", formData.coverPhoto);
    return await uploadInstituteCoverPhoto(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    // Prepare FormData for institute profile
    const instituteFormData = new FormData();
    instituteFormData.append("name", formData.name);
    instituteFormData.append("contact[officialEmail]", formData.email);
    instituteFormData.append("university", formData.university);
    instituteFormData.append("contact[phoneNumber]", formData.phone);
    instituteFormData.append("location[city]", formData.city);
    instituteFormData.append("location[country]", formData.country);
    instituteFormData.append("description", formData.description);

    formData.galleryPhotos.forEach((photo) => {
      instituteFormData.append("galleryPhotos", photo);
    });

    try {
      const profileResponse = await createInstituteProfile(instituteFormData);
      const profilePictureUpload = await handleProfilePictureUpload();
      const coverPhotoUpload = await handleCoverPhotoUpload();

      if (profileResponse?.data && profilePictureUpload && coverPhotoUpload) {
        console.log("Profile created successfully:", profileResponse.data);
        navigate("/"); // Redirect after success
      } else {
        throw new Error("Failed to create profile.");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      setError(error?.response?.data?.message || "An error occurred while creating the profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-300 to-primary-500 py-12 px-4 sm:px-6 lg:px-8 dark:bg-dark">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="mt-20 px-8 py-6 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Institute Profile Creation</h2>

            {/* Profile and Cover Photos */}
            <div>
              <label>Profile Photo</label>
              <input
                type="file"
                name="profilePicture"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full"
              />
              {formData.profilePicture && (
                <img
                  src={URL.createObjectURL(formData.profilePicture)}
                  alt="Profile Preview"
                  className="mt-4 w-32 h-32 object-cover rounded-full"
                />
              )}
            </div>

            <div>
              <label>Cover Photo</label>
              <input
                type="file"
                name="coverPhoto"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full"
              />
              {formData.coverPhoto && (
                <img
                  src={URL.createObjectURL(formData.coverPhoto)}
                  alt="Cover Preview"
                  className="mt-4 w-full h-48 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Institute Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Institute Name" name="name" value={formData.name} onChange={handleChange} />
              <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
              <InputField label="University" name="university" value={formData.university} onChange={handleChange} />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
              <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
              <InputField label="Country" name="country" value={formData.country} onChange={handleChange} />
            </div>

            {/* Description */}
            <div>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              ></textarea>
            </div>

            {/* Gallery Photos */}
            <div>
              <label>Gallery Photos</label>
              <input
                type="file"
                name="galleryPhotos"
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="w-full"
              />
              <div className="grid grid-cols-3 gap-2 mt-2">
                {formData.galleryPhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Gallery ${index}`}
                      className="w-20 h-20 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Messages */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Creating Profile..." : "Create Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label>{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      required
    />
  </div>
);

export default InstituteProfileCreationForm;

import React, { useState, useEffect } from "react";
import { ChangePassword } from "../../services/authService";
import { validPassword, checkConfirmPassword } from "../../utils/validators";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { DarkModeToggle as ExternalDarkModeToggle } from "../Common/themeChange";

const AccountSettings = () => {
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Change Password");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const togglePasswordVisibility = (field) => {
    if (field === "current") setShowCurrentPassword(!showCurrentPassword);
    if (field === "new") setShowNewPassword(!showNewPassword);
    if (field === "confirm") setShowConfirmPassword(!showConfirmPassword);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // Check for empty fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    // Check if new old password and new password match
    if (newPassword === currentPassword) {
      setError("New password and old password are the same.");
      return;
    }

    const confirmPasswordError = checkConfirmPassword(newPassword, confirmPassword);
    if (confirmPasswordError) {
      return setError(confirmPasswordError); // return the error message directly
    }

    const passwordError = validPassword(newPassword);
    if (passwordError) {
      return setError(passwordError); // display all errors at once
    }
    const data = {
      oldPassword: currentPassword,
      newPassword: newPassword,
    };

    try {
      const response = await ChangePassword(data);

      if (response.status === 200) {
        alert("Password saved successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else if (typeof response === "string") {
        // If result is a string, it's an error message
        alert(response);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const renderPasswordField = (label, id, value, setValue, showPassword, toggleVisibility) => (
    <div className="relative mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 dark:bg-gray-700 dark:text-white"
          placeholder={`Enter ${label.toLowerCase()}`}
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-400"
          onClick={toggleVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <IoEyeSharp className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );

  const changePassword = () => (
    <div className="bg-white dark:bg-container-dark p-6 rounded-lg shadow-lg relative z-10">
      {error && <div className="text-red-500 dark:text-red-400">{error}</div>}
      <h2 className="text-xl font-bold mb-4 dark:text-gray-300">Change Password</h2>
      <form onSubmit={handlePasswordChange}>
        {renderPasswordField("Current Password", "currentPassword", currentPassword, setCurrentPassword, showCurrentPassword, () => togglePasswordVisibility("current"))}
        {renderPasswordField("New Password", "newPassword", newPassword, setNewPassword, showNewPassword, () => togglePasswordVisibility("new"))}
        {renderPasswordField("Confirm Password", "confirmPassword", confirmPassword, setConfirmPassword, showConfirmPassword, () => togglePasswordVisibility("confirm"))}
        <button type="submit" className="w-full py-2 px-4 rounded-lg bg-button dark:bg-button-dark text-white dark:text-black hover:bg-button-dark hover:text-black dark:hover:bg-button dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
          Change Password
        </button>
      </form>
    </div>
  );

  const notificationPreferences = () => (
    <div className="bg-white dark:bg-container-dark p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 dark:text-gray-300">Notification Preferences</h2>
      <form>
        <div className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Email Notifications</span>
          </label>
        </div>
        <div className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">SMS Notifications</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Course Updates</span>
          </label>
        </div>
      </form>
    </div>
  );

  const deactivateAccount = () => (
    <div className="bg-white dark:bg-container-dark p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 dark:text-gray-300">Privacy & Security</h2>
      <div className="mb-4">
        <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Profile Visibility
        </label>
        <select
          id="profileVisibility"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>
      </div>
      <button
        onClick={() => console.log("Deactivate Account")}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Deactivate Account
      </button>
    </div>
  );

  const displayMode = () => (
    <div className="bg-white dark:bg-container-dark p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 dark:text-gray-300">Display Mode</h2>
      <ExternalDarkModeToggle />
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "Change Password":
        return changePassword();
      case "Notification Preferences":
        return notificationPreferences();
      case "Privacy & Security":
        return deactivateAccount();
      case "Display Mode":
        return displayMode();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 dark:bg-background-dark dark:text-white relative z-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 justify-self-center lg:justify-self-start">Settings</h1>
        </header>
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b mb-6">
          {["Change Password", "Notification Preferences", "Privacy & Security", "Display Mode"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${activeTab === tab
                ? "border-b-2 border-purple-500 text-purple-500"
                : "text-gray-500 hover:text-purple-500"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div className="w-full">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

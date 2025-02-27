import React, { useState, useEffect, useCallback } from "react";
import { ChangePassword } from "../../services/authService";
import { validPassword, checkConfirmPassword } from "../../utils/validators";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { DarkModeToggle } from "../Common/themeChange";

const PasswordField = ({ label, id, value, setValue, showPassword, toggleVisibility }) => (
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
    const theme = localStorage.getItem("theme");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const togglePasswordVisibility = useCallback((field) => {
    switch (field) {
      case "current":
        setShowCurrentPassword((prev) => !prev);
        break;
      case "new":
        setShowNewPassword((prev) => !prev);
        break;
      case "confirm":
        setShowConfirmPassword((prev) => !prev);
        break;
      default:
        break;
    }
  }, []);

  const handlePasswordChange = useCallback(async (e) => {
    e.preventDefault();
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password cannot be the same as the old password.");
      return;
    }

    const confirmError = checkConfirmPassword(newPassword, confirmPassword);
    if (confirmError) {
      setError(confirmError);
      return;
    }

    const passwordError = validPassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const response = await ChangePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      if (response.status === 200) {
        alert("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(response.message || "Failed to change password.");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setError("An error occurred. Please try again.");
    }
  }, [currentPassword, newPassword, confirmPassword]);

  const handlePreferencesSave = useCallback((e) => {
    e.preventDefault();
    alert("Preferences saved successfully!");
  }, []);

  const handleDeactivateAccount = useCallback(() => {
    if (window.confirm("Are you sure you want to deactivate your account?")) {
      alert("Account deactivated!");
    }
  }, []);

  const tabs = [
    "Change Password",
    "Notification Preferences",
    "Privacy & Security",
    "Display Mode",
  ];

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case "Change Password":
        return (
          <div className="bg-white dark:bg-container-dark p-6 rounded-lg shadow-lg relative z-10">
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <PasswordField
                label="Current Password"
                id="currentPassword"
                value={currentPassword}
                setValue={setCurrentPassword}
                showPassword={showCurrentPassword}
                toggleVisibility={() => togglePasswordVisibility("current")}
              />
              <PasswordField
                label="New Password"
                id="newPassword"
                value={newPassword}
                setValue={setNewPassword}
                showPassword={showNewPassword}
                toggleVisibility={() => togglePasswordVisibility("new")}
              />
              <PasswordField
                label="Confirm New Password"
                id="confirmPassword"
                value={confirmPassword}
                setValue={setConfirmPassword}
                showPassword={showConfirmPassword}
                toggleVisibility={() => togglePasswordVisibility("confirm")}
              />
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg bg-button dark:bg-button-dark text-white dark:text-black hover:bg-button-dark hover:text-black dark:hover:bg-button dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Change Password
              </button>
            </form>
          </div>
        );
      case "Notification Preferences":
        return (
          <div className="bg-white dark:bg-container-dark p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
            <form onSubmit={handlePreferencesSave}>
              {["Email Notifications", "SMS Notifications", "Course Updates"].map((label) => (
                <div key={label} className="mb-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                    <span className="ml-2 text-gray-700 dark:text-gray-200">{label}</span>
                  </label>
                </div>
              ))}
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg bg-button dark:bg-button-dark text-white dark:text-black hover:bg-button-dark hover:text-black dark:hover:bg-button dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Save Preferences
              </button>
            </form>
          </div>
        );
      case "Privacy & Security":
        return (
          <div className="bg-white dark:bg-container-dark p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Privacy & Security</h2>
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
              onClick={handleDeactivateAccount}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Deactivate Account
            </button>
          </div>
        );
      case "Display Mode":
        return (
          <div className="bg-white dark:bg-container-dark p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Display Mode</h2>
            <DarkModeToggle />
          </div>
        );
      default:
        return null;
    }
  }, [activeTab, error, currentPassword, newPassword, confirmPassword, handlePasswordChange, handlePreferencesSave, handleDeactivateAccount, togglePasswordVisibility]);

  return (
    <div className="min-h-screen p-4 dark:bg-background-dark dark:text-white relative z-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 justify-self-center lg:justify-self-start">Settings</h1>
        </header>
        <div className="flex overflow-x-auto border-b mb-6">
          {tabs.map((tab) => (
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
        <div className="w-full">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

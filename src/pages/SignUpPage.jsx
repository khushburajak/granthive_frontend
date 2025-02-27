import React, { useState, useEffect, lazy, Suspense } from "react";
import { Chrome, Facebook } from "lucide-react";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ChooseRole from "../components/HomePageComponents/ChooseRole";
import { register } from "../services/authService";
import useAuth from "../hooks/useAuth";
import { checkConfirmPassword, isEmail, validPassword } from "../utils/validators";

// Lazy load the SideBarHome component
const SideBarHome = lazy(() => import("../components/Common/defaultSidebar"));

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showChooseRole, setShowChooseRole] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", localStorage.getItem("theme") === "dark");
  }, []);

  const toggleShowPassword = () => setShowPassword(prev => !prev);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    const emailError = isEmail(email);
    if (emailError) return setError(emailError);

    const confirmPasswordError = checkConfirmPassword(password, confirmPassword);
    if (confirmPasswordError) return setError(confirmPasswordError);

    const passwordError = validPassword(password);
    if (passwordError) return setError(passwordError);

    setShowChooseRole(true);
  };

  const handleBack = () => setShowChooseRole(false);

  const handleSubmit = async (updatedFormData) => {
    try {
      const result = await register(updatedFormData);
      if (typeof result === "string") {
        alert(result);
      } else {
        alert("Sign-up successful!");
        loginUser({ email: updatedFormData.email, password: updatedFormData.password });

        navigate(updatedFormData.role === "Student" ? "/Student/studentprofile/create" : "/institution/instituteprofile/create");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-300 to-primary-500"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>

      <Suspense fallback={<div>Loading...</div>}>
        <SideBarHome />
      </Suspense>

      {showChooseRole ? (
        <ChooseRole formData={formData} onBack={handleBack} handleSubmit={handleSubmit} />
      ) : (
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 py-6 mt-15 dark:bg-background-dark dark:text-white z-10">
          <h1 className="text-2xl font-bold text-center mb-6">Create an account</h1>

          <div className="space-y-4 mb-6">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md hover:bg-red-600 transition">
              <Chrome size={20} className="text-red-500" />
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md hover:bg-blue-700 transition">
              <Facebook size={20} className="text-blue-600" />
              Continue with Facebook
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500 dark:text-gray-300">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {error && <div className="text-red-500">{error}</div>}

          <form onSubmit={handleNext} className="space-y-2">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-1 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-background-dark dark:text-white"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1 dark:text-gray-300">Email Address</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-background-dark dark:text-white"
                placeholder="Enter your email address"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-gray-700 mb-1 dark:text-gray-300">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-background-dark dark:text-white"
                placeholder="Enter your password"
              />
              <div onClick={toggleShowPassword} className="absolute right-10 top-10 cursor-pointer">
                {showPassword ? <IoEyeSharp /> : <FaEyeSlash />}
              </div>
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-1 dark:text-gray-300">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-background-dark dark:text-white"
                placeholder="Confirm your password"
              />
              <div onClick={toggleShowConfirmPassword} className="absolute right-10 top-10 cursor-pointer">
                {showConfirmPassword ? <IoEyeSharp /> : <FaEyeSlash />}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-button dark:bg-button-dark text-white py-2 rounded-md hover:bg-button-hover dark:hover:bg-button-darkhover transition focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              Next
            </button>
          </form>

          <p className="mt-3 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;

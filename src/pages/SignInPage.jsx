import React, { useState, useEffect, lazy, Suspense } from "react";
import { Chrome, Facebook } from "lucide-react";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { isEmail } from "../utils/validators";

// Lazy load the SideBarHome component
const SideBarHome = lazy(() => import("../components/Common/defaultSidebar"));

function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser, authState } = useAuth();
  const { error, loading } = authState;
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const { email, password } = formData;

    if (!email || !password) return setFormError("All fields are required");

    const emailError = isEmail(email);
    if (emailError) return setFormError(emailError);

    try {
      const response = await loginUser(formData);
      if (response) {
        setFormData({ email: "", password: "" });
        navigate("/");
      } else {
        setFormError("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setFormError(err?.response?.data?.message || "An error occurred");
    }
  };

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-background-dark">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-300 to-primary-500"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
      <Suspense fallback={<div>Loading...</div>}>
        <SideBarHome />
      </Suspense>
      <div className="w-full max-w-md z-10 rounded-lg bg-white p-6 shadow-md dark:bg-background-dark dark:text-white mx-4">
        <h2 className="mb-6 text-center text-2xl font-semibold">Sign In</h2>

        {/* Social Sign-In Buttons */}
        <button className="mb-4 flex w-full items-center justify-center gap-3 rounded-md border py-2 transition hover:bg-red-600 hover:text-white">
          <Chrome size={20} className="text-red-500" />
          Sign in with Google
        </button>
        <button className="mb-6 flex w-full items-center justify-center gap-3 rounded-md border py-2 transition hover:bg-blue-700 hover:text-white">
          <Facebook size={20} className="text-blue-600" />
          Sign in with Facebook
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500 dark:text-gray-300">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Error Messages */}
        {formError && <div className="text-red-500 text-sm mb-4">{formError}</div>}

        {/* Sign-In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              Email or Username
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email or username"
              className="mt-1 w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-background-dark dark:text-white"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-background-dark dark:text-white"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-10 text-gray-500 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IoEyeSharp /> : <FaEyeSlash />}
            </button>
            <div className="flex items-center justify-end mt-2">
              <Link to="/forgot-password" className="text-xs text-gray-400 hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-button dark:bg-button-dark text-white py-2 rounded-md hover:bg-button-hover dark:hover:bg-button-darkhover transition focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Sign-Up Link */}
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-500">Don't have an account? </span>
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;

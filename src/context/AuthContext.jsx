import React, { createContext, useState, useEffect, useCallback } from "react";
//API Services
import { login } from "../services/authService";
import { jwtDecode } from "jwt-decode";

// Create the AuthContext
export const AuthContext = createContext();

// Create a provider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    role: null,
    loading: true,
    error: null,
  });

  // Function to decode JWT token
  const decodeToken = (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Login function to handle user login
  const loginUser = useCallback(async (formData) => {
    setAuthState((prevState) => ({ ...prevState, loading: true, error: null }));

    try {
      const { data } = await login(formData);

      if (data) {
        const { user, token } = data;
        setAuthState({
          user,
          token,
          role: user?.role,
          loading: false,
          error: null,
        });
        localStorage.setItem("token", token);
        return true;
      } else {
        setAuthState((prevState) => ({
          ...prevState,
          loading: false,
          error: "Failed to log in, try again later",
        }));
        return false;
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setAuthState((prevState) => ({
        ...prevState,
        loading: false,
        error: error?.response?.data?.message || "Something went wrong",
      }));
      return false;
    }
  }, []);

  // Logout function to clear user data
  const logout = useCallback(() => {
    console.log("Logging out");
    localStorage.removeItem("token");
    setAuthState({
      user: null,
      token: null,
      role: null,
      loading: false,
      error: null,
    });
  }, []);

  // Check for token in localStorage and update authState
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const userData = decodeToken(token);

      if (userData) {
        setAuthState({
          user: userData,
          token,
          role: userData?.role,
          loading: false,
          error: null,
        });
      } else {
        logout(); // If decoding fails, log out
      }
    } else {
      setAuthState((prevState) => ({ ...prevState, loading: false }));
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ authState, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

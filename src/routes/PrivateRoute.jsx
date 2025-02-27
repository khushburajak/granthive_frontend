import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ allowedRoles }) => {
  const { authState } = useAuth(); // Get authState from context
  const { token, role, loading } = authState;

  if (loading) return <div>Loading...</div>; // Show loading indicator while auth state is loading

  // Redirect to login if no token exists
  if (!token) return <Navigate to="/" replace />;

  // Redirect to unauthorized page if role is not allowed
  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;

  // If all checks pass, render the child routes
  return <Outlet />;
};

export default PrivateRoute;

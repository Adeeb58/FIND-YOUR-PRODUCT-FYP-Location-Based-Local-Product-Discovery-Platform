// src/routes/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Render nothing or a loading spinner while auth status is being checked
    return null;
  }

  if (!isAuthenticated) {
    toast.error("You need to log in to access this page.");
    return <Navigate to="/login" replace />;
  }

  // Check if user has one of the allowed roles
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    toast.error("You do not have permission to access this page.");
    // Redirect based on user role or to a generic unauthorized page
    if (user.role === 'vendor') return <Navigate to="/vendor" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />; // Default redirect
  }

  return <Outlet />; // Render the child routes
};

export default ProtectedRoute;
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Replace with your token check
  const isAuthenticated = !!token; // Determine if the token indicates the user is authenticated

  // Redirect to login if not authenticated, otherwise render children
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;

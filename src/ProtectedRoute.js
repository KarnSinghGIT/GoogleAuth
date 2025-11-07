import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

/**
 * ProtectedRoute component that requires user authentication
 * If user is not logged in, redirects to login page
 */
function ProtectedRoute({ element }) {
  const { user, isLoading } = useUser();

  // While loading user data from localStorage, show a loading state
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Loading...</h2>
          <p>Please wait while we verify your session</p>
        </div>
      </div>
    );
  }

  // If user exists and is logged in, render the element
  if (user) {
    return element;
  }

  // Otherwise, redirect to login page
  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;


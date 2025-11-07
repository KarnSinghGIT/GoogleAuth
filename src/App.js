import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './UserContext'; // Add this import
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  return (
    <UserProvider> {/* Add this wrapper */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
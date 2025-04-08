import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './authentication/signup';
import Login from './authentication/login';
import Home from './task_management/home';
import NoPage from './404';
import './App.css';

// Protected route to prevent access without authentication
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
      
        <Route path="/" element={isAuthenticated ? <Home /> : <Signup />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <Signup />} />

          {/* check if user is authenticated */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

       
        <Route path="/*" element={<NoPage />} />
      </Routes>
    </Router>
  );
};

export default App;

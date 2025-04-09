import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './components/layout/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Box, Typography, Container, Paper } from '@mui/material';

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? (
              <Container maxWidth="sm">
                <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <LoginForm />
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography variant="body2">
                        Don't have an account?{' '}
                        <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
                          Register here
                        </Link>
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </Container>
            ) : (
              <Navigate to="/dashboard" />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            !isAuthenticated ? (
              <Container maxWidth="sm">
                <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <RegisterForm />
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography variant="body2">
                        Already have an account?{' '}
                        <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                          Login here
                        </Link>
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </Container>
            ) : (
              <Navigate to="/dashboard" />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;

// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from '../api/axios'; // Our configured axios instance
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user data if authenticated
  const [pendingUser, setPendingUser] = useState(null); // Stores user data pending OTP
  const [isAuthChecking, setIsAuthChecking] = useState(true); // Initial loading state
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for login/signup
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Function to check auth status on app load/refresh
  const checkAuthStatus = async () => {
    try {
      // Check if token exists
      const token = localStorage.getItem('fyp_auth_token');
      if (!token) {
        setIsAuthChecking(false);
        return;
      }

      // Verify token and get user data from backend
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const { data } = await axios.get('/auth/me', config);
      setUser(data);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem('fyp_auth_token');
      setUser(null);
    } finally {
      setIsAuthChecking(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      setIsSubmitting(true);

      const { data } = await axios.post('/auth/login', credentials);

      if (data.token) {
        localStorage.setItem('fyp_auth_token', data.token);
        setUser(data);
        toast.success('Logged in successfully!');
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        return { success: true };
      }

      if (data.requireOtp) {
        setPendingUser({ email: data.email, phone: data.phone });
        toast.success(data.message);
        if (data.devOtp) {
          toast(`Your OTP code is: ${data.devOtp}`, {
            icon: '🔑',
            duration: 6000,
            style: {
              background: '#333',
              color: '#fff',
            },
          });
        }
        return { success: true, requireOtp: true };
      }

    } catch (error) {
      const message = error.response?.data?.message || 'Login failed.';
      toast.error(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const signup = async (userData) => {
    try {
      setIsSubmitting(true);

      const { data } = await axios.post('/auth/register', userData);

      if (data.requireOtp) {
        setPendingUser({ email: data.email });
        toast.success(data.message);

        // Ensure devOtp is displayed if present (for testing without email)
        if (data.devOtp) {
          console.log("DEV OTP RECEIVED:", data.devOtp); // Debug log
          toast(`Your OTP code is: ${data.devOtp}`, {
            icon: '🔑',
            duration: 10000, // Longer duration
            style: {
              background: '#333',
              color: '#fff',
              border: '1px solid #4ade80'
            },
          });
        }
        return { success: true, requireOtp: true };
      }

      if (data.token) {
        localStorage.setItem('fyp_auth_token', data.token);
        setUser(data);
        toast.success('Account created successfully!');
        navigate('/');
        return { success: true };
      }

    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed.';
      toast.error(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (otp) => {
    if (!pendingUser) {
      toast.error("Session expired. Please sign up again.");
      return false;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.post('/auth/verify-otp', {
        email: pendingUser.email,
        otp
      });

      if (data.token) {
        localStorage.setItem('fyp_auth_token', data.token);
        setUser(data);
        setPendingUser(null);
        toast.success(data.message || 'Verified successfully!');
        navigate('/');
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Verification failed.';
      toast.error(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginWithOtpInit = async (phone) => {
    try {
      setIsSubmitting(true);
      const { data } = await axios.post('/auth/login-otp-init', { phone });

      if (data.success) {
        setPendingUser({ phone });
        toast.success(data.message);
        if (data.devOtp) {
          toast(`Your OTP code is: ${data.devOtp}`, {
            icon: '🔑',
            duration: 6000,
            style: {
              background: '#333',
              color: '#fff',
            },
          });
        }
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP.';
      toast.error(message);
      throw error; // Re-throw to handle in component
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginWithOtpVerify = async (otp) => {
    if (!pendingUser || !pendingUser.phone) {
      toast.error("Session expired. Please try again.");
      return false;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.post('/auth/login-otp-verify', {
        phone: pendingUser.phone,
        otp
      });

      if (data.token) {
        localStorage.setItem('fyp_auth_token', data.token);
        setUser(data);
        setPendingUser(null);
        toast.success('Logged in successfully!');
        navigate('/');
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Verification failed.';
      toast.error(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('fyp_auth_token');
      setUser(null);
      setPendingUser(null);
      queryClient.clear();
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed.');
    }
  };

  const authContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading: isSubmitting, // Expose as isLoading for backward compatibility if components use it for button loading
    isAuthChecking,
    login,
    logout,
    signup,
    verifyOtp,
    loginWithOtpInit,
    loginWithOtpVerify,
  };

  if (isAuthChecking) {
    // Or render a global spinner/skeleton while checking auth status
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl text-blue-600">
        Loading authentication...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
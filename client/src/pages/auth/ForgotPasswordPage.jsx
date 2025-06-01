import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForgotPasswordMutation } from '../../features/api/apiSlice';
import { setNotification } from '../../features/ui/uiSlice';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);
  
  // Form state
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Forgot password mutation
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  
  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };
  
  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await forgotPassword(email).unwrap();
        
        // Show success message
        setSuccess(true);
        
        dispatch(setNotification({
          type: 'success',
          message: 'Password reset link has been sent to your email',
          duration: 5000
        }));
      } catch (err) {
        dispatch(setNotification({
          type: 'error',
          message: err.data?.message || 'Failed to send reset link. Please try again.',
          duration: 5000
        }));
      }
    }
  };
  
  const inputClass = `w-full px-3 py-2 rounded-md border ${
    isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-700'
  } focus:ring-primary-500 focus:border-primary-500`;
  
  const errorClass = 'text-red-500 text-sm mt-1';

  return (
    <div className="max-w-md w-full mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Enter your email to receive a password reset link
        </p>
      </div>
      
      <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
        {success ? (
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
              isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-600'
            } mb-4`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold mb-2">Email Sent</h2>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              We've sent a password reset link to <span className="font-medium">{email}</span>.
              Please check your inbox and follow the instructions to reset your password.
            </p>
            
            <div className="mt-6">
              <Link
                to="/login"
                className="text-primary-600 hover:underline"
              >
                Return to login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleChange}
                className={inputClass}
                placeholder="your.email@example.com"
              />
              {error && <p className={errorClass}>{error}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded-md bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Sending...</span>
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
            
            <div className="text-center mt-6">
              <Link
                to="/login"
                className="text-primary-600 hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useResetPasswordMutation } from '../../features/api/apiSlice';
import { setNotification } from '../../features/ui/uiSlice';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);
  
  // Form state
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  // Reset password mutation
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await resetPassword({
          token,
          password: formData.password,
        }).unwrap();
        
        // Show success message
        setSuccess(true);
        
        dispatch(setNotification({
          type: 'success',
          message: 'Password has been reset successfully',
          duration: 5000
        }));
        
        // Navigate to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        dispatch(setNotification({
          type: 'error',
          message: err.data?.message || 'Failed to reset password. Please try again.',
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
        <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Enter your new password below
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
            
            <h2 className="text-xl font-semibold mb-2">Password Reset Successful</h2>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your password has been reset successfully. You will be redirected to the login page in a few seconds.
            </p>
            
            <div className="mt-6">
              <Link
                to="/login"
                className="text-primary-600 hover:underline"
              >
                Go to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Password input */}
            <div className="mb-4">
              <label htmlFor="password" className="block mb-1 font-medium">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={inputClass}
                placeholder="••••••••"
              />
              {errors.password && <p className={errorClass}>{errors.password}</p>}
            </div>
            
            {/* Confirm Password input */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block mb-1 font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClass}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword}</p>}
            </div>
            
            {/* Password requirements */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Password must:
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc pl-5 space-y-1">
                <li>Be at least 6 characters long</li>
                <li>Include at least one uppercase letter</li>
                <li>Include at least one number</li>
                <li>Include at least one special character</li>
              </ul>
            </div>
            
            {/* Submit button */}
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
                  <span className="ml-2">Resetting password...</span>
                </div>
              ) : (
                'Reset Password'
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

export default ResetPasswordPage;

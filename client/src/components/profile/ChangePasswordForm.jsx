import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';

const ChangePasswordForm = ({ onSubmit }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  
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
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };
  
  const inputClass = `w-full rounded-md px-3 py-2 ${
    isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-700'
  } border focus:ring-primary-500 focus:border-primary-500`;
  
  const errorClass = 'text-red-500 text-sm mt-1';

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Current password field */}
        <div>
          <label htmlFor="currentPassword" className="block mb-1">
            Current Password *
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter your current password"
          />
          {errors.currentPassword && <p className={errorClass}>{errors.currentPassword}</p>}
        </div>
        
        {/* New password field */}
        <div>
          <label htmlFor="newPassword" className="block mb-1">
            New Password *
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter your new password"
          />
          {errors.newPassword && <p className={errorClass}>{errors.newPassword}</p>}
        </div>
        
        {/* Confirm password field */}
        <div>
          <label htmlFor="confirmPassword" className="block mb-1">
            Confirm New Password *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={inputClass}
            placeholder="Confirm your new password"
          />
          {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword}</p>}
        </div>
      </div>
      
      {/* Submit button */}
      <div className="mt-6">
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
        >
          Update Password
        </button>
      </div>
      
      {/* Password requirements */}
      <div className="mt-4">
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
    </form>
  );
};

export default ChangePasswordForm;

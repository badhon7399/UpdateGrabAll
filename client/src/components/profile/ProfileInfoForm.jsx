import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';

const ProfileInfoForm = ({ user, onSubmit }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    ...user
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.phone && !/^01[3-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Bangladeshi phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
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
        {/* Name field */}
        <div>
          <label htmlFor="name" className="block mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>
        
        {/* Email field */}
        <div>
          <label htmlFor="email" className="block mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            disabled={user?.provider !== 'local'} // Disable if social login
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
          {user?.provider !== 'local' && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Email cannot be changed for accounts linked with {user?.provider}
            </p>
          )}
        </div>
        
        {/* Phone field */}
        <div>
          <label htmlFor="phone" className="block mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g., 01712345678"
          />
          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </div>
        
        {/* Avatar URL field */}
        <div>
          <label htmlFor="avatar" className="block mb-1">
            Profile Picture URL (Optional)
          </label>
          <input
            type="url"
            id="avatar"
            name="avatar"
            value={formData.avatar || ''}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://example.com/your-image.jpg"
          />
        </div>
      </div>
      
      {/* Submit button */}
      <div className="mt-6">
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ProfileInfoForm;

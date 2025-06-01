import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';

const AddressForm = ({ initialValues = {}, onSubmit, onCancel }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  
  const [formData, setFormData] = useState({
    fullName: initialValues.fullName || '',
    phone: initialValues.phone || '',
    address: initialValues.address || '',
    city: initialValues.city || '',
    postalCode: initialValues.postalCode || '',
    division: initialValues.division || 'Dhaka',
    isDefault: initialValues.isDefault || false,
    ...initialValues
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
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
    
    // Required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^01[3-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Bangladeshi phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
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
  
  // Bangladesh divisions
  const divisions = [
    'Dhaka', 
    'Chittagong', 
    'Rajshahi', 
    'Khulna', 
    'Barisal', 
    'Sylhet', 
    'Rangpur', 
    'Mymensingh'
  ];
  
  const inputClass = `w-full px-3 py-2 rounded-md border ${
    isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-700'
  } focus:ring-primary-500 focus:border-primary-500`;
  
  const errorClass = 'text-red-500 text-sm mt-1';

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label htmlFor="fullName" className="block mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={inputClass}
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
        </div>
        
        {/* Phone */}
        <div className="md:col-span-2">
          <label htmlFor="phone" className="block mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g., 01712345678"
          />
          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </div>
        
        {/* Address */}
        <div className="md:col-span-2">
          <label htmlFor="address" className="block mb-1">
            Address *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={inputClass}
            placeholder="Street address, house/apartment number"
          />
          {errors.address && <p className={errorClass}>{errors.address}</p>}
        </div>
        
        {/* City */}
        <div>
          <label htmlFor="city" className="block mb-1">
            City/Area *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={inputClass}
            placeholder="City or area name"
          />
          {errors.city && <p className={errorClass}>{errors.city}</p>}
        </div>
        
        {/* Postal Code */}
        <div>
          <label htmlFor="postalCode" className="block mb-1">
            Postal Code *
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g., 1212"
          />
          {errors.postalCode && <p className={errorClass}>{errors.postalCode}</p>}
        </div>
        
        {/* Division */}
        <div className="md:col-span-2">
          <label htmlFor="division" className="block mb-1">
            Division *
          </label>
          <select
            id="division"
            name="division"
            value={formData.division}
            onChange={handleChange}
            className={inputClass}
          >
            {divisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>
        
        {/* Default address checkbox */}
        <div className="md:col-span-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="mr-2 accent-primary-600"
            />
            <span>Set as default address</span>
          </label>
        </div>
      </div>
      
      {/* Form actions */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded-md ${
            isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
          } transition-colors`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
        >
          {initialValues._id ? 'Update Address' : 'Add Address'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;

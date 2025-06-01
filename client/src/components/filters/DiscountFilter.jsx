import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import { FiPercent } from 'react-icons/fi';

const DiscountFilter = ({ minDiscount = 0, onChange }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  
  const discountOptions = [
    { value: 0, label: 'All Products' },
    { value: 10, label: '10% or more' },
    { value: 20, label: '20% or more' },
    { value: 30, label: '30% or more' },
    { value: 40, label: '40% or more' },
    { value: 50, label: '50% or more' }
  ];
  
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3">Discount</h3>
      <div className="space-y-3">
        {discountOptions.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`discount-${option.value}`}
              name="discount"
              checked={minDiscount === option.value}
              onChange={() => onChange(option.value)}
              className="mr-2 h-4 w-4 accent-primary-600"
            />
            <label 
              htmlFor={`discount-${option.value}`}
              className="text-sm cursor-pointer hover:text-primary-600 transition-colors flex items-center"
            >
              {option.value > 0 && (
                <span className={`flex items-center justify-center w-5 h-5 rounded-full mr-2 ${
                  isDarkMode ? 'bg-primary-700' : 'bg-primary-100'
                } text-primary-600`}>
                  <FiPercent size={12} />
                </span>
              )}
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountFilter;

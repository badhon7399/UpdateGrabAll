import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';

const QuantitySelector = ({ value, onChange, min = 1, max = 10, small = false }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  
  // Handle increment
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };
  
  // Handle decrement
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };
  
  // Handle direct input
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue)) {
      // Clamp value between min and max
      const clampedValue = Math.min(max, Math.max(min, newValue));
      onChange(clampedValue);
    }
  };
  
  const buttonBaseClass = `${
    small ? 'w-7 h-7' : 'w-9 h-9'
  } flex items-center justify-center rounded-md`;
  
  const buttonClass = `${buttonBaseClass} ${
    isDarkMode 
      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
  }`;
  
  const disabledButtonClass = `${buttonBaseClass} ${
    isDarkMode 
      ? 'bg-gray-800 text-gray-600' 
      : 'bg-gray-100 text-gray-400'
  } cursor-not-allowed`;
  
  return (
    <div className="flex items-center">
      <button 
        onClick={handleDecrement} 
        disabled={value <= min}
        className={value <= min ? disabledButtonClass : buttonClass}
        aria-label="Decrease quantity"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={small ? "h-3 w-3" : "h-4 w-4"} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      
      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        className={`${
          small ? 'w-10 h-7 text-sm' : 'w-14 h-9'
        } mx-2 text-center rounded-md ${
          isDarkMode 
            ? 'bg-gray-700 border-gray-600 text-white' 
            : 'bg-white border-gray-300 text-gray-700'
        } border focus:ring-primary-500 focus:border-primary-500`}
      />
      
      <button 
        onClick={handleIncrement} 
        disabled={value >= max}
        className={value >= max ? disabledButtonClass : buttonClass}
        aria-label="Increase quantity"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={small ? "h-3 w-3" : "h-4 w-4"} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default QuantitySelector;

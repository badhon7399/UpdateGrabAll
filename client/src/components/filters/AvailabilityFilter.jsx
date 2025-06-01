import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import { FiCheck, FiX } from 'react-icons/fi';

const AvailabilityFilter = ({ inStock = null, onChange }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3">Availability</h3>
      <div className="space-y-3">
        {/* All products option */}
        <div className="flex items-center">
          <input
            type="radio"
            id="availability-all"
            name="availability"
            checked={inStock === null}
            onChange={() => onChange(null)}
            className="mr-2 h-4 w-4 accent-primary-600"
          />
          <label 
            htmlFor="availability-all"
            className="text-sm cursor-pointer hover:text-primary-600 transition-colors flex items-center"
          >
            All Products
          </label>
        </div>
        
        {/* In stock option */}
        <div className="flex items-center">
          <input
            type="radio"
            id="availability-in-stock"
            name="availability"
            checked={inStock === true}
            onChange={() => onChange(true)}
            className="mr-2 h-4 w-4 accent-primary-600"
          />
          <label 
            htmlFor="availability-in-stock"
            className="text-sm cursor-pointer hover:text-primary-600 transition-colors flex items-center"
          >
            <span className="flex items-center">
              <FiCheck className="mr-1 text-green-500" size={16} />
              In Stock
            </span>
          </label>
        </div>
        
        {/* Out of stock option */}
        <div className="flex items-center">
          <input
            type="radio"
            id="availability-out-of-stock"
            name="availability"
            checked={inStock === false}
            onChange={() => onChange(false)}
            className="mr-2 h-4 w-4 accent-primary-600"
          />
          <label 
            htmlFor="availability-out-of-stock"
            className="text-sm cursor-pointer hover:text-primary-600 transition-colors flex items-center"
          >
            <span className="flex items-center">
              <FiX className="mr-1 text-red-500" size={16} />
              Out of Stock
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityFilter;

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';

const PriceRangeFilter = ({ minPrice = 0, maxPrice = 100000, onChange }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  // Update local state when props change
  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  // Handle input changes
  const handleMinChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setLocalMinPrice(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.min(100000, parseInt(e.target.value) || 0);
    setLocalMaxPrice(value);
  };

  // Apply filter
  const handleApplyFilter = () => {
    // Ensure min is not greater than max
    const validMinPrice = Math.min(localMinPrice, localMaxPrice);
    const validMaxPrice = Math.max(localMinPrice, localMaxPrice);
    
    onChange({ minPrice: validMinPrice, maxPrice: validMaxPrice });
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3">Price Range</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label 
            htmlFor="min-price" 
            className="block text-sm mb-1"
          >
            Min Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">৳</span>
            <input
              type="number"
              id="min-price"
              value={localMinPrice}
              onChange={handleMinChange}
              min="0"
              max="100000"
              className={`w-full pl-6 pr-2 py-2 rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-700'
              } border focus:ring-primary-500 focus:border-primary-500`}
            />
          </div>
        </div>
        
        <div>
          <label 
            htmlFor="max-price" 
            className="block text-sm mb-1"
          >
            Max Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">৳</span>
            <input
              type="number"
              id="max-price"
              value={localMaxPrice}
              onChange={handleMaxChange}
              min="0"
              max="100000"
              className={`w-full pl-6 pr-2 py-2 rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-700'
              } border focus:ring-primary-500 focus:border-primary-500`}
            />
          </div>
        </div>
      </div>
      
      {/* Price range slider representation */}
      <div className="mb-4 px-1">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-md relative">
          <div
            className="absolute h-full bg-primary-600 rounded-md"
            style={{
              left: `${(localMinPrice / 100000) * 100}%`,
              right: `${100 - (localMaxPrice / 100000) * 100}%`
            }}
          ></div>
        </div>
      </div>
      
      <button
        onClick={handleApplyFilter}
        className="w-full py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
      >
        Apply Filter
      </button>
    </div>
  );
};

export default PriceRangeFilter;

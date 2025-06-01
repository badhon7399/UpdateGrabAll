import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import { FiSearch } from 'react-icons/fi';

const BrandFilter = ({ brands = [], selectedBrands = [], onChange }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Filter brands based on search term
  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Toggle brand selection
  const handleBrandToggle = (brandId) => {
    const newSelectedBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter(id => id !== brandId)
      : [...selectedBrands, brandId];
    
    onChange(newSelectedBrands);
  };
  
  // Clear all selected brands
  const handleClearAll = () => {
    onChange([]);
  };
  
  // Determine which brands to display
  const displayBrands = isExpanded ? filteredBrands : filteredBrands.slice(0, 5);
  const hasMoreBrands = filteredBrands.length > 5;
  
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3">Brands</h3>
      
      {/* Search input */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-9 pr-3 py-2 rounded-md ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-700 placeholder-gray-500'
          } border focus:ring-primary-500 focus:border-primary-500`}
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      
      {/* Brand list */}
      <div className={`space-y-2 max-h-60 overflow-y-auto ${isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
        {displayBrands.length > 0 ? (
          displayBrands.map((brand) => (
            <div key={brand._id} className="flex items-center">
              <input
                type="checkbox"
                id={`brand-${brand._id}`}
                checked={selectedBrands.includes(brand._id)}
                onChange={() => handleBrandToggle(brand._id)}
                className="mr-2 h-4 w-4 rounded accent-primary-600"
              />
              <label 
                htmlFor={`brand-${brand._id}`}
                className="text-sm cursor-pointer hover:text-primary-600 transition-colors flex items-center justify-between w-full"
              >
                <span>{brand.name}</span>
                {brand.productCount && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {brand.productCount}
                  </span>
                )}
              </label>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No brands found</p>
        )}
      </div>
      
      {/* Show more/less button */}
      {hasMoreBrands && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      )}
      
      {/* Clear all button - only show if brands are selected */}
      {selectedBrands.length > 0 && (
        <button
          onClick={handleClearAll}
          className="mt-3 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default BrandFilter;

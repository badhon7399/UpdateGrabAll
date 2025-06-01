import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import { FiFilter, FiArrowUp, FiArrowDown, FiStar, FiClock, FiDollarSign } from 'react-icons/fi';

const SortOptions = ({ selectedSort, onChange }) => {
  const isDarkMode = useSelector(selectIsDarkMode);

  const options = [
    { value: 'newest', label: 'Newest', icon: <FiClock /> },
    { value: 'price-low-high', label: 'Price: Low to High', icon: <FiArrowUp /> },
    { value: 'price-high-low', label: 'Price: High to Low', icon: <FiArrowDown /> },
    { value: 'top-rated', label: 'Top Rated', icon: <FiStar /> },
    { value: 'best-selling', label: 'Best Selling', icon: <FiDollarSign /> }
  ];

  return (
    <div className="flex items-center">
      <label htmlFor="sort-options" className="text-sm mr-2 font-medium">
        Sort by:
      </label>
      <div className="relative">
        <select
          id="sort-options"
          value={selectedSort}
          onChange={(e) => onChange(e.target.value)}
          className={`appearance-none rounded-md border pl-9 pr-8 py-2 text-sm ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-700'
          } focus:ring-primary-500 focus:border-primary-500 cursor-pointer`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
          {options.find(option => option.value === selectedSort)?.icon || <FiFilter />}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SortOptions;

import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';

const CategoryFilter = ({ categories, selectedCategory, onChange }) => {
  const isDarkMode = useSelector(selectIsDarkMode);

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3">Categories</h3>
      <div className={`space-y-2 max-h-60 overflow-y-auto ${isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
        {/* All categories option */}
        <div className="flex items-center">
          <input
            type="radio"
            id="category-all"
            name="category"
            checked={!selectedCategory}
            onChange={() => onChange('')}
            className="mr-2 h-4 w-4 accent-primary-600"
          />
          <label 
            htmlFor="category-all"
            className="text-sm cursor-pointer hover:text-primary-600 transition-colors"
          >
            All Categories
          </label>
        </div>
        
        {/* Category list */}
        {Array.isArray(categories) && categories.map((category) => (
          <div key={category._id} className="flex items-center">
            <input
              type="radio"
              id={`category-${category._id}`}
              name="category"
              checked={selectedCategory === category._id}
              onChange={() => onChange(category._id)}
              className="mr-2 h-4 w-4 accent-primary-600"
            />
            <label 
              htmlFor={`category-${category._id}`}
              className="text-sm cursor-pointer hover:text-primary-600 transition-colors"
            >
              {category.name} {category.productCount && `(${category.productCount})`}
            </label>
          </div>
        ))}
        
        {/* No categories message */}
        {(!categories || categories.length === 0) && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No categories available
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;

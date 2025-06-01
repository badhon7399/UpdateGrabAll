import React from 'react';

const StarRating = ({ 
  value = 0, 
  onChange = null, 
  size = 'md', 
  readOnly = false 
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const starClass = sizeClasses[size] || sizeClasses.md;
  
  // Convert to number and limit to 0-5 range
  const rating = Math.min(5, Math.max(0, Number(value)));
  
  // Generate array of 5 stars
  const stars = [...Array(5)].map((_, index) => {
    const starValue = index + 1;
    
    // Determine the fill level of each star
    let fillType = 'empty';
    if (rating >= starValue) {
      fillType = 'full';
    } else if (rating >= starValue - 0.5) {
      fillType = 'half';
    }
    
    return { 
      starValue, 
      fillType 
    };
  });
  
  // Handle star click for interactive rating
  const handleClick = (starValue) => {
    if (!readOnly && onChange) {
      onChange(starValue);
    }
  };

  return (
    <div className="flex">
      {stars.map(({ starValue, fillType }) => (
        <span 
          key={starValue}
          onClick={() => handleClick(starValue)}
          className={`${!readOnly && 'cursor-pointer'}`}
          role={!readOnly ? 'button' : undefined}
          aria-label={!readOnly ? `Rate ${starValue} stars` : `Rated ${rating} out of 5 stars`}
        >
          {fillType === 'full' && (
            <svg 
              className={`${starClass} text-yellow-400`} 
              fill="currentColor" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          )}
          {fillType === 'half' && (
            <svg 
              className={`${starClass} text-yellow-400`} 
              fill="currentColor" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
            </svg>
          )}
          {fillType === 'empty' && (
            <svg 
              className={`${starClass} text-gray-300 dark:text-gray-600`} 
              fill="currentColor" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
};

export default StarRating;

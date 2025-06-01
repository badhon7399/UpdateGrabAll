import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import { FaStar, FaRegStar } from 'react-icons/fa';

const RatingFilter = ({ selectedRating = 0, onChange }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  
  const ratingOptions = [5, 4, 3, 2, 1];
  
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3">Rating</h3>
      <div className="space-y-3">
        {/* All ratings option */}
        <div className="flex items-center">
          <input
            type="radio"
            id="rating-all"
            name="rating"
            checked={selectedRating === 0}
            onChange={() => onChange(0)}
            className="mr-2 h-4 w-4 accent-primary-600"
          />
          <label 
            htmlFor="rating-all"
            className="text-sm cursor-pointer hover:text-primary-600 transition-colors flex items-center"
          >
            All Ratings
          </label>
        </div>
        
        {/* Rating options */}
        {ratingOptions.map((rating) => (
          <div key={rating} className="flex items-center">
            <input
              type="radio"
              id={`rating-${rating}`}
              name="rating"
              checked={selectedRating === rating}
              onChange={() => onChange(rating)}
              className="mr-2 h-4 w-4 accent-primary-600"
            />
            <label 
              htmlFor={`rating-${rating}`}
              className="text-sm cursor-pointer hover:text-primary-600 transition-colors flex items-center"
            >
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">
                  {i < rating ? <FaStar size={14} /> : <FaRegStar size={14} />}
                </span>
              ))}
              <span className="ml-1">& Up</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingFilter;

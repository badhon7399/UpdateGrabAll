import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import StarRating from '../ui/StarRating';

const ProductReviews = ({ reviews = [] }) => {
  const isDarkMode = useSelector(selectIsDarkMode);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Sort reviews by date (most recent first)
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="space-y-6">
      {sortedReviews.map((review) => (
        <div 
          key={review._id} 
          className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="font-medium">{review.user.name}</div>
              <div className="flex items-center mt-1">
                <StarRating value={review.rating} readOnly size="sm" />
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {review.verified && (
              <div className="flex items-center text-green-600 text-sm">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Verified Purchase
              </div>
            )}
          </div>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {review.comment}
          </p>
          {review.reply && (
            <div className={`mt-3 ml-6 p-3 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="font-medium text-primary-600 mb-1">Store Response</div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {review.reply}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;

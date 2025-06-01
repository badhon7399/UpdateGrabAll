import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import StarRating from '../ui/StarRating';

const ReviewForm = ({ onSubmit, isLoading, onCancel }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (rating < 1) {
      setError('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      setError('Please enter a review comment');
      return;
    }
    
    // Clear error and submit
    setError('');
    onSubmit({ rating, comment });
  };

  return (
    <div className={`rounded-lg p-4 mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <form onSubmit={handleSubmit}>
        <h3 className="font-semibold mb-4">Write a Review</h3>
        
        {/* Rating selector */}
        <div className="mb-4">
          <label className="block mb-2">Your Rating</label>
          <div className="flex items-center">
            <StarRating 
              value={rating} 
              onChange={setRating}
              size="lg"
            />
            <span className="ml-2">
              {rating} {rating === 1 ? 'star' : 'stars'}
            </span>
          </div>
        </div>
        
        {/* Review comment */}
        <div className="mb-4">
          <label htmlFor="review-comment" className="block mb-2">
            Your Review
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="What did you like or dislike about this product? How was the quality?"
            className={`w-full rounded-md px-3 py-2 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-700'
            } border focus:ring-primary-500 focus:border-primary-500`}
          />
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 text-red-500">
            {error}
          </div>
        )}
        
        {/* Form actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md ${
              isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;

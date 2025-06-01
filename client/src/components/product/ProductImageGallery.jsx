import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';

const ProductImageGallery = ({ images = [] }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Handle no images case
  if (!images || images.length === 0) {
    return (
      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center h-96`}>
        <p className="text-gray-500 dark:text-gray-400">No images available</p>
      </div>
    );
  }

  return (
    <div>
      {/* Main large image */}
      <div className={`rounded-lg overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mb-4`}>
        <img 
          src={images[selectedImageIndex]} 
          alt={`Product view ${selectedImageIndex + 1}`}
          className="w-full h-96 object-contain"
        />
      </div>
      
      {/* Thumbnail images */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`rounded-md overflow-hidden ${
                index === selectedImageIndex 
                  ? 'ring-2 ring-primary-600' 
                  : `border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`
              }`}
            >
              <img 
                src={image} 
                alt={`Product thumbnail ${index + 1}`}
                className="w-full h-16 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;

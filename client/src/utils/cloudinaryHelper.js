/**
 * Helper functions for handling Cloudinary image uploads in the client
 */

// Function to create a form data object with an image file
export const createImageFormData = (file) => {
  const formData = new FormData();
  formData.append('images', file);
  return formData;
};

// Function to create a form data object with multiple image files
export const createMultipleImagesFormData = (files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });
  return formData;
};

// Function to create form data for a single image upload (avatar, category image, etc.)
export const createSingleImageFormData = (file, fieldName = 'image') => {
  const formData = new FormData();
  formData.append(fieldName, file);
  return formData;
};

// Function to extract just the Cloudinary IDs from full URLs
export const getCloudinaryIdFromUrl = (url) => {
  if (!url) return null;
  
  // Extract the Cloudinary ID from the URL (e.g., 'graball/products/abcdef123' from the full URL)
  const matches = url.match(/graball\/\w+\/([^/]+)/);
  return matches ? matches[1] : null;
};

// Function to transform Cloudinary URLs for better quality or sizing
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url) return '';
  
  // If it's not a Cloudinary URL, return the original URL
  if (!url.includes('cloudinary.com')) return url;
  
  const { width, height, quality = 80, crop = 'fill' } = options;
  let transformations = `q_${quality}`;
  
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  if (crop) transformations += `,c_${crop}`;
  
  // Insert transformations into the URL
  // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/path/to/image.jpg
  // To: https://res.cloudinary.com/cloud_name/image/upload/q_80,w_800,h_600,c_fill/v1234567890/path/to/image.jpg
  return url.replace('/upload/', `/upload/${transformations}/`);
};

// Function to get responsive image sizes for different devices
export const getResponsiveImageUrl = (url) => {
  if (!url) return {};
  
  return {
    thumbnail: getOptimizedImageUrl(url, { width: 100, height: 100, crop: 'thumb' }),
    small: getOptimizedImageUrl(url, { width: 300, height: 300 }),
    medium: getOptimizedImageUrl(url, { width: 600, height: 600 }),
    large: getOptimizedImageUrl(url, { width: 1200, height: 1200 }),
    original: url
  };
};

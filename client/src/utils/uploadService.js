/**
 * Direct upload service for product images
 * This bypasses RTK Query to troubleshoot the upload issues
 */

import axios from 'axios';

// Base API URL
const API_URL = 'http://localhost:5000/api';

/**
 * Upload product images directly
 * @param {FormData} formData - FormData object containing images
 * @param {string|null} productId - Product ID for existing products, null for new products
 * @returns {Promise} - Promise resolving to upload result
 */
export const uploadProductImages = async (formData, productId = null) => {
  try {
    // Determine the endpoint based on whether we have a productId
    const endpoint = productId 
      ? `${API_URL}/products/${productId}/images` 
      : `${API_URL}/upload/images`;
    
    console.log(`Uploading images to: ${endpoint}`);
    
    // Make direct axios request
    const response = await axios.post(endpoint, formData, {
      headers: {
        // Let the browser set the correct Content-Type with boundary
        // for multipart/form-data
      },
      withCredentials: true, // Include cookies for auth
    });
    
    console.log('Upload response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Image upload error:', error.response || error);
    throw error;
  }
};

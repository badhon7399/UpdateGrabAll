import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  useGetBannersQuery, 
  useCreateBannerMutation, 
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useUploadBannerImageMutation
} from '../../features/api/apiSlice';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import { selectCurrentUser } from '../../features/auth/authSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminBannersPage = () => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const user = useSelector(selectCurrentUser);
  
  // Form state
  const [formData, setFormData] = useState({
    buttonText: 'SHOP NOW',
    link: '/products',
    showButton: true,
    image: {
      public_id: '',
      url: ''
    },
    active: true,
    position: 1
  });
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [currentBannerId, setCurrentBannerId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  
  // Fetch banners
  const { data, isLoading, error } = useGetBannersQuery();
  
  // Extract banners array from response
  const banners = data?.banners || data || [];
  
  // Mutations
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
  const [uploadBannerImage] = useUploadBannerImageMutation();
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseInt(value) : value
    });
  };
  
  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Create form data for upload
      const imageFormData = new FormData();
      imageFormData.append('image', file);
      
      // For new banners, we need to create a temporary ID
      const tempBannerId = currentBannerId || 'temp-' + Date.now();
      
      // Upload image with the correct structure
      const result = await uploadBannerImage({
        bannerId: tempBannerId,
        formData: imageFormData
      }).unwrap();
      
      // Add uploaded image URL to state
      setFormData(prev => ({
        ...prev,
        image: {
          public_id: result.public_id || tempBannerId,
          url: result.imageUrl || result.url || result.image
        }
      }));
      
      // Reset file input
      setFileInputKey(Date.now());
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Set up form for editing a banner
  const handleEditBanner = (banner) => {
    setFormData({
      buttonText: banner.buttonText || 'SHOP NOW',
      link: banner.link || '/products',
      showButton: banner.showButton !== undefined ? banner.showButton : true,
      image: banner.image && typeof banner.image === 'object' 
        ? banner.image 
        : {
            public_id: banner._id || 'temp-id',
            url: typeof banner.image === 'string' ? banner.image : ''
          },
      active: banner.active !== undefined ? banner.active : true,
      position: banner.position || 1
    });
    
    setCurrentBannerId(banner._id);
    setIsEditing(true);
    
    // Scroll to the form section
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      buttonText: 'SHOP NOW',
      link: '/products',
      showButton: true,
      image: {
        public_id: '',
        url: ''
      },
      active: true,
      position: 1
    });
    setCurrentBannerId(null);
    setIsEditing(false);
    setFileInputKey(Date.now()); // Reset file input
  };
  
  // Submit form for creating or updating a banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image.url) {
      alert('Banner image is required');
      return;
    }
    
    // Prepare data for submission
    let bannerData = {
      ...formData,
      createdBy: user?._id // Make sure user is available from auth state
    };
    
    // If button is not shown, ensure we still send default values for required fields
    if (!formData.showButton) {
      bannerData = {
        ...bannerData,
        buttonText: formData.buttonText || 'SHOP NOW',
        link: formData.link || '/products'
      };
    }
    
    try {
      if (isEditing) {
        // Update existing banner
        await updateBanner({
          id: currentBannerId,
          ...bannerData
        }).unwrap();
        alert('Banner updated successfully');
      } else {
        // Create new banner
        await createBanner(bannerData).unwrap();
        alert('Banner created successfully');
      }
      
      // Reset form after submission
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} banner: ${error.message || 'Unknown error'}`);
    }
  };
  
  // Delete a banner
  const handleDeleteBanner = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteBanner(id).unwrap();
        alert('Banner deleted successfully');
        
        // If the deleted banner was being edited, reset the form
        if (currentBannerId === id) {
          resetForm();
        }
      } catch (error) {
        console.error('Error:', error);
        alert(`Failed to delete banner: ${error.message || 'Unknown error'}`);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800'}`}>
        <h2 className="text-lg font-semibold mb-2">Error Loading Banners</h2>
        <p>Failed to load banners. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Banner Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Banner Form */}
        <div className="lg:col-span-1">
          <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Edit Banner' : 'Add New Banner'}
            </h2>
            <form onSubmit={handleSubmit}>

              {/* Show Button Option */}
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showButton"
                    name="showButton"
                    checked={formData.showButton}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showButton" className="ml-2 block text-sm font-medium">
                    Show Button on Banner
                  </label>
                </div>
              </div>

              {formData.showButton && (
                <>
                  {/* Button Text */}
                  <div className="mb-4">
                    <label htmlFor="buttonText" className="block text-sm font-medium mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      id="buttonText"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  
                  {/* Button Link */}
                  <div className="mb-4">
                    <label htmlFor="link" className="block text-sm font-medium mb-1">
                      Button Link
                    </label>
                    <input
                      type="text"
                      id="link"
                      name="link"
                      value={formData.link || ''}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </>
              )}
              
              {/* Position */}
              <div className="mb-4">
                <label htmlFor="position" className="block text-sm font-medium mb-1">
                  Display Position
                </label>
                <input
                  type="number"
                  id="position"
                  name="position"
                  min="1"
                  max="10"
                  value={formData.position || 1}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Lower numbers display first (1 is highest priority)
                </p>
              </div>
              
              {/* Active Status */}
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm font-medium">
                    Active
                  </label>
                </div>
              </div>
              
              {/* Banner Image */}
              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium mb-1">
                  Banner Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  id="image"
                  key={fileInputKey}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={`w-full px-4 py-2 rounded-md border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                {isUploading && (
                  <div className="mt-2 flex items-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2 text-sm">Uploading...</span>
                  </div>
                )}
              </div>
              
              {/* Image Preview */}
              {formData.image && formData.image.url && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-1">Image Preview</p>
                  <div className={`border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-md p-2`}>
                    <img
                      src={formData.image.url}
                      alt="Banner Preview"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                </div>
              )}
              
              {/* Form Buttons */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isCreating || isUpdating || isUploading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(isCreating || isUpdating) ? (
                    <span className="flex items-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    isEditing ? 'Update Banner' : 'Add Banner'
                  )}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`px-4 py-2 rounded-md ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    } transition-colors`}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        
        {/* Banners List */}
        <div className="lg:col-span-2">
          <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h2 className="text-xl font-semibold mb-4">Banners</h2>
            
            {!banners || banners.length === 0 ? (
              <div className="text-center py-8">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  No banners found. Add your first banner using the form.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.isArray(banners) && banners.map((banner) => (
                  <div 
                    key={banner._id} 
                    className={`border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200`}
                  >
                    <div className="relative h-48">
                      <img 
                        src={banner.image?.url || ''} 
                        alt="Banner"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://picsum.photos/800/400';
                        }}
                      />
                      {!banner.active && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs rounded-md">
                          Inactive
                        </div>
                      )}
                      <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800/70 text-white text-xs rounded-md">
                        Position: {banner.position}
                      </div>
                    </div>
                    <div className="p-4">
                      {banner.showButton !== false ? (
                        <>
                          <div className={`inline-block mt-2 px-3 py-1 rounded-md ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                            {banner.buttonText}
                          </div>
                          <div className="mt-2 text-xs truncate max-w-full">
                            <span className="font-medium">Link:</span> {banner.link}
                          </div>
                        </>
                      ) : (
                        <div className="mt-2 text-xs inline-block px-3 py-1 rounded-md bg-yellow-100 text-yellow-800">
                          No Button
                        </div>
                      )}
                      <div className="mt-4 flex justify-end items-center gap-2">
                        <button
                          onClick={() => handleEditBanner(banner)}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700"
                          title="Edit Banner"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner._id)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-50 dark:hover:bg-gray-700"
                          title="Delete Banner"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBannersPage;

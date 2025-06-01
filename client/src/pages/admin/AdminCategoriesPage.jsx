import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  useGetCategoriesQuery, 
  useCreateCategoryMutation, 
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUploadCategoryImageMutation
} from '../../features/api/apiSlice';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminCategoriesPage = () => {
  const isDarkMode = useSelector(selectIsDarkMode);
  
  // State for the category form
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  
  // Fetch categories
  const { data: categoriesData, isLoading, error } = useGetCategoriesQuery();
  
  // Mutations
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [uploadCategoryImage] = useUploadCategoryImageMutation();
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
      
      // Upload image
      const result = await uploadCategoryImage(imageFormData).unwrap();
      
      // Add uploaded image URL to state
      setFormData(prev => ({
        ...prev,
        image: result.imageUrl
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
  
  // Set up form for editing a category
  const handleEditCategory = (category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || ''
    });
    setCurrentCategoryId(category._id);
    setEditMode(true);
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: ''
    });
    setCurrentCategoryId(null);
    setEditMode(false);
    setFileInputKey(Date.now()); // Reset file input
  };
  
  // Submit form for creating or updating a category
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      alert('Category name is required');
      return;
    }
    
    try {
      if (editMode) {
        // Update existing category
        await updateCategory({
          id: currentCategoryId,
          categoryData: formData
        }).unwrap();
        alert('Category updated successfully');
      } else {
        // Create new category
        await createCategory(formData).unwrap();
        alert('Category created successfully');
      }
      
      // Reset form after submission
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to ${editMode ? 'update' : 'create'} category: ${error.message || 'Unknown error'}`);
    }
  };
  
  // Delete a category
  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This may affect products assigned to this category.')) {
      try {
        await deleteCategory(id).unwrap();
        alert('Category deleted successfully');
        
        // If the deleted category was being edited, reset the form
        if (currentCategoryId === id) {
          resetForm();
        }
      } catch (error) {
        console.error('Error:', error);
        alert(`Failed to delete category: ${error.message || 'Unknown error'}`);
      }
    }
  };
  
  // Filter categories based on search term
  const filteredCategories = categoriesData?.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
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
        <h2 className="text-lg font-semibold mb-2">Error Loading Categories</h2>
        <p>Failed to load categories. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Form */}
        <div className="lg:col-span-1">
          <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Category Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              {/* Category Description */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                ></textarea>
              </div>
              
              {/* Category Image */}
              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium mb-1">
                  Category Image
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
              {formData.image && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-1">Image Preview</p>
                  <div className={`border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-md p-2`}>
                    <img
                      src={formData.image}
                      alt="Category Preview"
                      className="h-32 w-full object-cover rounded-md"
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
                      {editMode ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    editMode ? 'Update Category' : 'Add Category'
                  )}
                </button>
                {editMode && (
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
        
        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Categories</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-64 px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {filteredCategories.length === 0 ? (
              <div className="text-center py-4">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  {searchTerm 
                    ? 'No categories found matching your search.' 
                    : 'No categories found. Add your first category using the form.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredCategories.map((category) => (
                      <tr key={category._id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className={`h-10 w-10 rounded-md flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">{category.name}</div>
                          {category.description && (
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {category.description.length > 50
                                ? `${category.description.substring(0, 50)}...`
                                : category.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {category.productCount || 0} products
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              disabled={isDeleting}
                              className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;

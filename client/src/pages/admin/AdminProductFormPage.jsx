import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  useGetProductByIdQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation
} from '../../features/api/apiSlice';
import { uploadProductImages } from '../../utils/uploadService';
import { createMultipleImagesFormData, getOptimizedImageUrl } from '../../utils/cloudinaryHelper';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);
  const isEditMode = Boolean(id);
  
  // Initial form state
  const initialFormState = {
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: '',
    brand: '',
    countInStock: '',
    sku: '',
    images: [],
    isActive: true,
    isFeatured: false,
    specifications: [{ key: '', value: '' }]
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  
  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading, refetch: refetchCategories } = useGetCategoriesQuery();
  
  // Create category mutation
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
  
  // Fetch product data if in edit mode
  const { data: product, isLoading: isProductLoading } = useGetProductByIdQuery(id, {
    skip: !isEditMode,
  });
  
  // Mutations for creating and updating products
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  
  // Populate form data when product is loaded in edit mode
  useEffect(() => {
    if (isEditMode && product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        compareAtPrice: product.compareAtPrice || '',
        category: product.category?._id || '',
        brand: product.brand || '',
        countInStock: product.countInStock || '',
        sku: product.sku || '',
        images: product.images || [],
        isActive: product.isActive !== undefined ? product.isActive : true,
        isFeatured: product.isFeatured || false,
        specifications: product.specifications && product.specifications.length > 0 
          ? product.specifications.map(spec => ({ key: spec.key, value: spec.value }))
          : [{ key: '', value: '' }]
      });
      setUploadedImages(product.images || []);
    }
  }, [product, isEditMode]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'category' && value === 'new-category') {
      setShowNewCategoryForm(true);
      return;
    }
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  // Handle new category form input changes
  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Create new category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategory.name) {
      alert('Category name is required');
      return;
    }
    
    try {
      const result = await createCategory(newCategory).unwrap();
      
      // Close the form
      setShowNewCategoryForm(false);
      
      // Reset the form
      setNewCategory({ name: '', description: '' });
      
      // Refetch categories
      await refetchCategories();
      
      // Select the new category
      setFormData(prev => ({
        ...prev,
        category: result.data._id
      }));
      
      alert('Category created successfully!');
    } catch (error) {
      console.error('Error creating category:', error);
      alert(`Failed to create category: ${error.message || 'Unknown error'}`);
    }
  };
  
  // Cancel new category creation
  const handleCancelCategoryCreation = () => {
    setShowNewCategoryForm(false);
    setNewCategory({ name: '', description: '' });
    setFormData(prev => ({
      ...prev,
      category: ''
    }));
  };
  
  // Handle specification changes
  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
    setFormData({ ...formData, specifications: updatedSpecs });
  };
  
  // Add new specification field
  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: '', value: '' }],
    });
  };
  
  // Remove specification field
  const removeSpecification = (index) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs.splice(index, 1);
    setFormData({ ...formData, specifications: updatedSpecs });
  };
  
  // Handle image upload with Cloudinary using direct upload service
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Log the files being uploaded for debugging
      console.log('Files to upload:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));
      
      // Create form data with multiple images
      const formData = createMultipleImagesFormData(files);
      
      // Upload images directly using our upload service
      // For new products, pass null as productId
      // For existing products, pass the actual productId
      const productIdParam = isEditMode ? id : null;
      
      // Log the upload request
      console.log(`Uploading images ${isEditMode ? 'for product ' + id : 'for new product'}`);
      
      // Use the direct upload service
      const result = await uploadProductImages(formData, productIdParam);
      
      console.log('Upload result:', result);
      
      // Add uploaded image URLs to state
      if (result.images && result.images.length > 0) {
        setUploadedImages(prev => [...prev, ...result.images]);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...result.images]
        }));
      } else {
        console.error('No images returned in result:', result);
        setUploadError('Server processed the upload but returned no images.');
      }
      
      // Reset file input
      setFileInputKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to upload images:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      setUploadError(`Failed to upload images: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  // Remove image
  const removeImage = (indexToRemove) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.price || !formData.category) {
      alert('Please fill in all required fields: Name, Price, and Category.');
      return;
    }
    
    // Filter out empty specifications
    const filteredSpecs = formData.specifications.filter(
      spec => spec.key.trim() !== '' && spec.value.trim() !== ''
    );
    
    // Prepare data for submission
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : 0,
      countInStock: parseInt(formData.countInStock),
      specifications: filteredSpecs,
    };
    
    try {
      if (isEditMode) {
        // Update existing product
        await updateProduct({ id, ...productData }).unwrap();
        alert('Product updated successfully!');
      } else {
        // Create new product
        const result = await createProduct(productData).unwrap();
        console.log('Product creation result:', result);
        alert('Product created successfully!');
        
        // If images were uploaded for a new product, now we can associate them
        if (result.data && result.data._id && formData.images.length > 0) {
          // In case we need to update the product with its images
          console.log('Product has images that need to be associated');
        }
      }
      
      // Clear any cached products data to force a refresh
      dispatch({ type: 'api/invalidateTags', payload: [{ type: 'Product', id: 'LIST' }] });
      dispatch({ type: 'api/invalidateTags', payload: [{ type: 'Product', id: 'FEATURED' }] });
      dispatch({ type: 'api/invalidateTags', payload: [{ type: 'Product', id: 'NEW' }] });
      
      // Wait a moment to ensure cache invalidation is complete before navigating
      setTimeout(() => {
        // Navigate back to products list
        navigate('/admin/products');
      }, 500);
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} product: ${error.message || 'Unknown error'}`);
    }
  };
  
  // Show loading spinner while fetching data
  if ((isEditMode && isProductLoading) || isCategoriesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="col-span-2">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Product Name <span className="text-red-500">*</span>
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
            
            {/* Product Description */}
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              ></textarea>
            </div>
            
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                Price (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            {/* Compare At Price */}
            <div>
              <label htmlFor="compareAtPrice" className="block text-sm font-medium mb-1">
                Compare At Price (৳)
              </label>
              <input
                type="number"
                id="compareAtPrice"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Select Category</option>
                <option value="new-category" className="font-semibold text-primary-600 dark:text-primary-500">
                  + Create New Category
                </option>
                {categories?.data ? (
                  // If data is in categories.data (like {data: [...categories]})
                  categories.data.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                ) : Array.isArray(categories) ? (
                  // If categories is a direct array
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                ) : null}
              </select>
            </div>
            
            {/* New Category Form Modal */}
            {showNewCategoryForm && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <h3 className="text-lg font-bold mb-4">Create New Category</h3>
                  <form onSubmit={handleCreateCategory}>
                    <div className="mb-4">
                      <label htmlFor="categoryName" className="block text-sm font-medium mb-1">Category Name *</label>
                      <input
                        type="text"
                        id="categoryName"
                        name="name"
                        value={newCategory.name}
                        onChange={handleNewCategoryChange}
                        className={`w-full p-2 border rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="categoryDescription" className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        id="categoryDescription"
                        name="description"
                        value={newCategory.description}
                        onChange={handleNewCategoryChange}
                        className={`w-full p-2 border rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        rows="3"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancelCategoryCreation}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isCreatingCategory}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                      >
                        {isCreatingCategory ? 'Creating...' : 'Create Category'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block text-sm font-medium mb-1">
                Brand
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            {/* Stock */}
            <div>
              <label htmlFor="countInStock" className="block text-sm font-medium mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                id="countInStock"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            {/* SKU */}
            <div>
              <label htmlFor="sku" className="block text-sm font-medium mb-1">
                SKU
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            {/* Status Toggles */}
            <div className="flex space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm font-medium">
                  Active
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm font-medium">
                  Featured
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Images Section */}
        <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Product Images</h2>
          
          {/* Image Upload */}
          <div className="mb-6">
            <label htmlFor="images" className="block text-sm font-medium mb-2">
              Upload Images
            </label>
            <input
              type="file"
              id="images"
              key={fileInputKey}
              accept="image/*"
              multiple
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
            {uploadError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{uploadError}</p>
            )}
          </div>
          
          {/* Image Preview */}
          {uploadedImages.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Product Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {uploadedImages.map((image, index) => (
                  <div 
                    key={index}
                    className={`relative rounded-lg overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <img 
                      src={getOptimizedImageUrl(image, { width: 200, height: 200, crop: 'fill' })} 
                      alt={`Product ${index + 1}`}
                      className="h-24 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Specifications Section */}
        <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Specifications</h2>
            <button
              type="button"
              onClick={addSpecification}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Specification
            </button>
          </div>
          
          {formData.specifications.map((spec, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Key (e.g. Material)"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Value (e.g. Cotton)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={() => removeSpecification(index)}
                className="text-red-500 hover:text-red-700"
                disabled={formData.specifications.length === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isCreating || isUpdating || isUploading}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(isCreating || isUpdating) ? (
              <span className="flex items-center">
                <LoadingSpinner size="sm" className="mr-2" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              isEditMode ? 'Update Product' : 'Create Product'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className={`px-6 py-2 rounded-md ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            } transition-colors`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductFormPage;

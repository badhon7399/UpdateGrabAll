import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FiUpload, FiX, FiEdit } from 'react-icons/fi';

// Import the demo products from the list component
import { demoProducts, updateDemoProduct } from '../../components/admin/DemoProductsList';

const AdminDemoProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDarkMode = useSelector(selectIsDarkMode);

  // Initial form state
  const initialFormState = {
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: { _id: '', name: '' },
    brand: '',
    countInStock: '',
    slug: '',
    images: [],
    newImageUrl: '',  // For adding new image URLs
    isActive: true,
    isFeatured: false
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Available categories for demo products
  const demoCategories = [
    { _id: 'demo-cat-1', name: 'Furniture' },
    { _id: 'demo-cat-2', name: 'Electronics' },
    { _id: 'demo-cat-3', name: 'Clothing' },
    { _id: 'demo-cat-4', name: 'Home Decor' },
    { _id: 'demo-cat-5', name: 'Accessories' }
  ];

  useEffect(() => {
    // Find the product by ID from our demo products array
    const product = demoProducts.find(p => p._id === id);
    
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice || '',
        category: product.category,
        brand: product.brand || '',
        countInStock: product.countInStock,
        slug: product.slug,
        images: product.images,
        isActive: product.isActive,
        isFeatured: product.isFeatured
      });
      setIsLoading(false);
    } else {
      setError('Demo product not found');
      setIsLoading(false);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update the demo product in our local array
      const updatedProduct = {
        ...formData,
        _id: id, // Ensure ID remains the same
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        countInStock: Number(formData.countInStock)
      };
      
      // Call the update function
      const success = updateDemoProduct(id, updatedProduct);
      
      if (success) {
        setSuccessMessage('Demo product updated successfully');
        setTimeout(() => {
          navigate('/admin/products');
        }, 2000);
      } else {
        setError('Failed to update demo product');
      }
    } catch (err) {
      setError('An error occurred while updating the product');
    }
    
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'category') {
      const selectedCategory = demoCategories.find(cat => cat._id === value);
      setFormData({
        ...formData,
        category: selectedCategory || { _id: value, name: '' }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  // Handle adding a new image
  const handleAddImage = (e) => {
    e.preventDefault();
    if (formData.newImageUrl.trim()) {
      // Validate URL format
      try {
        new URL(formData.newImageUrl);
        setFormData({
          ...formData,
          images: [...formData.images, { url: formData.newImageUrl }],
          newImageUrl: '' // Clear input after adding
        });
      } catch (error) {
        setError('Please enter a valid URL');
        setTimeout(() => setError(null), 3000);
      }
    }
  };
  
  // Handle removing an image
  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages
    });
  };
  
  // Handle editing an image URL
  const handleEditImageUrl = (index, newUrl) => {
    try {
      new URL(newUrl); // Validate URL format
      const updatedImages = [...formData.images];
      updatedImages[index] = { ...updatedImages[index], url: newUrl };
      setFormData({
        ...formData,
        images: updatedImages
      });
    } catch (error) {
      setError('Please enter a valid URL');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800'}`}>
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  const formClasses = isDarkMode 
    ? 'bg-gray-800 border border-gray-700' 
    : 'bg-white border border-gray-300';

  const inputClasses = isDarkMode
    ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-500 focus:ring-primary-500'
    : 'bg-white border-gray-300 text-gray-900 focus:border-primary-600 focus:ring-primary-600';

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Demo Product</h1>
        <button
          onClick={() => navigate('/admin/products')}
          className={`px-4 py-2 rounded-md ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
          } transition-colors`}
        >
          Back to Products
        </button>
      </div>

      {successMessage && (
        <div className={`mb-6 p-4 rounded-lg ${
          isDarkMode ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-800'
        }`}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow-md ${formClasses}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full rounded-md border p-2.5 ${inputClasses}`}
            />
          </div>
          
          {/* Product Slug */}
          <div>
            <label htmlFor="slug" className="block mb-2 text-sm font-medium">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className={`w-full rounded-md border p-2.5 ${inputClasses}`}
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block mb-2 text-sm font-medium">
              Price (in cents)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className={`w-full rounded-md border p-2.5 ${inputClasses}`}
            />
          </div>
          
          {/* Compare at Price */}
          <div>
            <label htmlFor="compareAtPrice" className="block mb-2 text-sm font-medium">
              Compare at Price (Optional)
            </label>
            <input
              type="number"
              id="compareAtPrice"
              name="compareAtPrice"
              value={formData.compareAtPrice}
              onChange={handleChange}
              className={`w-full rounded-md border p-2.5 ${inputClasses}`}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block mb-2 text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category._id}
              onChange={handleChange}
              required
              className={`w-full rounded-md border p-2.5 ${inputClasses}`}
            >
              <option value="">Select Category</option>
              {demoCategories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block mb-2 text-sm font-medium">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`w-full rounded-md border p-2.5 ${inputClasses}`}
            />
          </div>

          {/* Inventory / Stock */}
          <div>
            <label htmlFor="countInStock" className="block mb-2 text-sm font-medium">
              Inventory
            </label>
            <input
              type="number"
              id="countInStock"
              name="countInStock"
              value={formData.countInStock}
              onChange={handleChange}
              required
              className={`w-full rounded-md border p-2.5 ${inputClasses}`}
            />
          </div>

          {/* Checkboxes for status */}
          <div className="md:col-span-2 flex flex-wrap gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600"
              />
              <label htmlFor="isActive" className="ml-2 text-sm font-medium">
                Active (Visible in store)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600"
              />
              <label htmlFor="isFeatured" className="ml-2 text-sm font-medium">
                Featured (Shown on homepage)
              </label>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-6">
          <label htmlFor="description" className="block mb-2 text-sm font-medium">
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`w-full rounded-md border p-2.5 ${inputClasses}`}
          ></textarea>
        </div>

        {/* Product Images */}
        <div className="mt-6">
          <label className="block mb-2 text-sm font-medium">
            Product Images
          </label>
          <div className="flex flex-wrap gap-4 mb-4">
            {formData.images && formData.images.map((image, index) => (
              <div 
                key={index} 
                className="relative h-40 w-40 rounded overflow-hidden border group"
              >
                <img 
                  src={image.url} 
                  alt={`Product image ${index + 1}`} 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newUrl = prompt('Enter new image URL:', image.url);
                      if (newUrl && newUrl !== image.url) {
                        handleEditImageUrl(index, newUrl);
                      }
                    }}
                    className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
                    title="Edit URL"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                    title="Remove Image"
                  >
                    <FiX size={16} />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 text-center">
                  Image {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Add new image URL */}
          <div className="mt-4">
            <label htmlFor="newImageUrl" className="block mb-2 text-sm font-medium">
              Add Image by URL
            </label>
            <div className="flex">
              <input
                type="text"
                id="newImageUrl"
                name="newImageUrl"
                value={formData.newImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={`flex-1 rounded-l-md border p-2.5 ${inputClasses}`}
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-r-md transition-colors"
              >
                <FiUpload className="inline mr-1" /> Add
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Provide a direct URL to an image. The image will be displayed but not uploaded to your server.
            </p>
          </div>
        </div>

        {/* Submit button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-md ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            } transition-colors`}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDemoProductEditPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

// Demo products data from the images - export for use in edit page
export const demoProducts = [
  {
    _id: 'demo-product-1',
    name: 'Portable Laptop Desk',
    slug: 'portable-laptop-desk',
    description: 'Elegant portable laptop desk with foldable legs, perfect for working from bed, couch, or any comfortable spot.',
    price: 2499,
    compareAtPrice: 2999,
    brand: 'ComfortDesk',
    countInStock: 25,
    category: { name: 'Furniture', _id: 'demo-cat-1' },
    images: [{ url: 'https://i.imgur.com/RcKQbmE.jpg' }],
    rating: 4.5,
    numReviews: 12,
    discount: 17,
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'demo-product-2',
    name: 'SKE Mini DC UPS',
    slug: 'ske-mini-dc-ups',
    description: 'Reliable mini DC UPS for small electronics and network devices. Provides backup power during outages.',
    price: 3500,
    compareAtPrice: 3999,
    brand: 'SKE',
    countInStock: 15,
    category: { name: 'Electronics', _id: 'demo-cat-2' },
    images: [{ url: 'https://i.imgur.com/NPpjchn.jpg' }],
    rating: 4.2,
    numReviews: 8,
    discount: 12,
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'demo-product-3',
    name: 'Casio fx-991CW Scientific Calculator',
    slug: 'casio-calculator',
    description: 'Advanced scientific calculator with natural textbook display and 552 functions.',
    price: 1799,
    compareAtPrice: 1999,
    brand: 'Casio',
    countInStock: 30,
    category: { name: 'Office Supplies', _id: 'demo-cat-3' },
    images: [{ url: 'https://i.imgur.com/7xHsKkJ.jpg' }],
    rating: 4.8,
    numReviews: 25,
    discount: 10,
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'demo-product-4',
    name: 'Personalized LED Night Light',
    slug: 'personalized-led-night-light',
    description: 'Custom LED night light with personalized names and a heart symbol. Perfect romantic gift.',
    price: 1299,
    compareAtPrice: 1599,
    brand: 'LoveLight',
    countInStock: 20,
    category: { name: 'Gifts', _id: 'demo-cat-4' },
    images: [{ url: 'https://i.imgur.com/I8b5tjE.jpg' }],
    rating: 4.7,
    numReviews: 15,
    discount: 19,
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'demo-product-5',
    name: 'Love Pearl Gift Set',
    slug: 'love-pearl-gift-set',
    description: 'Unique gift featuring a real cultured pearl inside an oyster, with an elegant pendant necklace.',
    price: 1999,
    compareAtPrice: 2499,
    brand: 'Pearl Treasures',
    countInStock: 10,
    category: { name: 'Gifts', _id: 'demo-cat-4' },
    images: [{ url: 'https://i.imgur.com/a9F4CaH.jpg' }],
    rating: 4.6,
    numReviews: 18,
    discount: 20,
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const DemoProductsList = ({ isDarkMode, onDelete }) => {
  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this demo product?')) {
      onDelete && onDelete(id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="my-6">
      <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mb-4 pb-2`}>
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Demo Products
        </h3>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          These are sample products created from the provided images.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
            <tr>
              <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400 uppercase tracking-wider' : 'text-gray-500 uppercase tracking-wider'}`}>
                Product
              </th>
              <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400 uppercase tracking-wider' : 'text-gray-500 uppercase tracking-wider'}`}>
                Category
              </th>
              <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400 uppercase tracking-wider' : 'text-gray-500 uppercase tracking-wider'}`}>
                Price
              </th>
              <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400 uppercase tracking-wider' : 'text-gray-500 uppercase tracking-wider'}`}>
                Stock
              </th>
              <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400 uppercase tracking-wider' : 'text-gray-500 uppercase tracking-wider'}`}>
                Status
              </th>
              <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400 uppercase tracking-wider' : 'text-gray-500 uppercase tracking-wider'}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {demoProducts.map((product) => (
              <tr key={product._id} className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img 
                        className="h-10 w-10 rounded-md object-cover" 
                        src={product.images[0]?.url} 
                        alt={product.name} 
                      />
                    </div>
                    <div className="ml-4">
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {product.name}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Added on {formatDate(product.createdAt)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                    {product.category.name}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ৳{product.price.toLocaleString()}
                  </div>
                  {product.compareAtPrice > 0 && (
                    <div className={`text-xs line-through ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      ৳{product.compareAtPrice.toLocaleString()}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {product.countInStock}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive 
                    ? (isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') 
                    : (isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')}`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link to={`/admin/demo-products/${product._id}/edit`} className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}`}>
                      <FiEdit size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDeleteProduct(product._id)}
                      className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                    >
                      <FiTrash2 size={18} />
                    </button>
                    <Link to={`/products/${product.slug}`} className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>
                      <FiEye size={18} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Function to update a demo product
export const updateDemoProduct = (id, updatedProduct) => {
  try {
    // Find the product index
    const index = demoProducts.findIndex(p => p._id === id);
    
    if (index !== -1) {
      // Update the product in the array
      demoProducts[index] = {
        ...demoProducts[index],
        ...updatedProduct
      };
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating demo product:', error);
    return false;
  }
};

export default DemoProductsList;

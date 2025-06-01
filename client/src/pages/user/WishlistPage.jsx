import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../../utils/formatters';

const WishlistPage = () => {
  const user = useSelector(selectCurrentUser);
  const isDarkMode = useSelector(selectIsDarkMode);
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        setIsLoading(true);
        // This would be replaced with an actual API call
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulating API call
        
        // Mock wishlist data - in a real app, this would come from your API
        const mockWishlist = [
          {
            _id: 'prod1',
            name: 'Wireless Bluetooth Earbuds',
            description: 'High-quality sound with noise cancellation',
            price: 79.99,
            image: 'https://picsum.photos/seed/product-wish-1/300/300',
            inStock: true,
            rating: 4.5
          },
          {
            _id: 'prod2',
            name: 'Smart Fitness Tracker',
            description: 'Track your activities and monitor your health',
            price: 129.99,
            image: 'https://picsum.photos/seed/product-wish-1/300/300',
            inStock: true,
            rating: 4.2
          },
          {
            _id: 'prod3',
            name: 'Ultra HD Smart TV - 55"',
            description: 'Crystal clear display with smart features',
            price: 799.99,
            image: 'https://picsum.photos/seed/product-wish-1/300/300',
            inStock: false,
            rating: 4.8
          }
        ];
        
        setWishlistItems(mockWishlist);
      } catch (error) {
        toast.error('Failed to load wishlist');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchWishlistItems();
    }
  }, [user]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      setIsLoading(true);
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulating API call
      
      setWishlistItems(wishlistItems.filter(item => item._id !== productId));
      toast.success('Item removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item from wishlist');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      // This would be replaced with an actual API call to add to cart
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulating API call
      
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error(error);
    }
  };

  if (!user) return <LoadingSpinner fullScreen />;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center`}>
            <p className="text-lg mb-4">Your wishlist is empty</p>
            <Link
              to="/products"
              className={`px-4 py-2 rounded-md ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors inline-block`}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {wishlistItems.map(item => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium">
                            <Link 
                              to={`/products/${item._id}`}
                              className="hover:underline"
                            >
                              {item.name}
                            </Link>
                          </h4>
                          <p className="mt-1 text-sm truncate max-w-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium">
                        {formatCurrency(item.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.inStock}
                          className={`px-3 py-1 rounded ${
                            item.inStock
                              ? isDarkMode
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                              : isDarkMode
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          } transition-colors`}
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item._id)}
                          className={`px-3 py-1 rounded ${
                            isDarkMode
                              ? 'bg-red-900 hover:bg-red-800 text-red-200'
                              : 'bg-red-100 hover:bg-red-200 text-red-600'
                          } transition-colors`}
                        >
                          Remove
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
  );
};

export default WishlistPage;

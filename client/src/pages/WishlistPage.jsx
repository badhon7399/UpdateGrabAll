import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiTrash2, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { addToCart } from '../features/cart/cartSlice';
import { removeFromWishlist, selectWishlistItems } from '../features/wishlist/wishlistSlice';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const [movingToCart, setMovingToCart] = useState({});

  const handleAddToCart = (item) => {
    setMovingToCart(prev => ({ ...prev, [item.id]: true }));
    
    setTimeout(() => {
      dispatch(addToCart({
        product: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: 1,
        variant: item.variant
      }));
      
      setTimeout(() => {
        dispatch(removeFromWishlist(item.id));
        setMovingToCart(prev => ({ ...prev, [item.id]: false }));
      }, 300);
    }, 500);
  };

  const handleRemoveFromWishlist = (itemId) => {
    dispatch(removeFromWishlist(itemId));
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Wishlist</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {wishlistItems.length === 0 
            ? "Your wishlist is empty" 
            : `${wishlistItems.length} item${wishlistItems.length > 1 ? 's' : ''} in your wishlist`}
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
            <FiHeart size={36} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
            Add items you love to your wishlist. Review them anytime and easily move them to your cart.
          </p>
          <Link 
            to="/products" 
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition duration-200"
          >
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map(item => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="relative">
                <Link to={`/products/${item.slug}`}>
                  <img 
                    src={item.image || '/images/placeholder.jpg'} 
                    alt={item.name} 
                    className="w-full h-56 object-cover hover:opacity-90 transition duration-200"
                  />
                </Link>
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-900 rounded-full shadow-md text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
              
              <div className="p-4">
                <Link to={`/products/${item.slug}`} className="block">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
                    {item.name}
                  </h3>
                </Link>
                
                {item.variant && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {item.variant.name}: {item.variant.value}
                  </p>
                )}
                
                <div className="flex justify-between items-center mt-3">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${item.price.toFixed(2)}
                  </span>
                  
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={movingToCart[item.id]}
                    className={`flex items-center justify-center px-4 py-2 rounded text-sm font-medium transition-colors ${
                      movingToCart[item.id]
                        ? 'bg-green-500 text-white'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    {movingToCart[item.id] ? (
                      'Added to Cart'
                    ) : (
                      <>
                        <FiShoppingCart size={16} className="mr-1" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

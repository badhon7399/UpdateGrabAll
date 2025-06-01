import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { setNotification } from '../../features/ui/uiSlice';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import StarRating from '../ui/StarRating';
import { AiOutlineHeart, AiFillHeart, AiOutlineEye } from 'react-icons/ai';
import { BsCart2 } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

// Base64 encoded placeholder image (1x1 px transparent GIF)
const PLACEHOLDER_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

const ProductCard = ({ product, variant = 'default' }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Navigate to product details page
  const goToProductDetails = () => {
    if (product && product.slug) {
      navigate(`/products/${product.slug}`);
    }
  };
  
  // Handle add to cart action
  const handleAddToCart = () => {    
    if (product.countInStock > 0) {
      // Safely extract image URL or use placeholder
      const imageUrl = product.images && product.images[0] && product.images[0].url 
        ? product.images[0].url 
        : PLACEHOLDER_IMAGE;
        
      const cartItem = {
        product: product._id,
        name: product.name,
        image: { url: imageUrl },
        price: product.compareAtPrice || product.price,
        discountedPrice: product.discount > 0 ? (product.price - (product.price * product.discount / 100)).toFixed(0) : product.price,
        countInStock: product.countInStock,
        quantity: 1,
      };
      
      dispatch(addToCart(cartItem));
      dispatch(setNotification({
        type: 'success',
        message: `${product.name} added to cart`,
        duration: 3000
      }));
      
      console.log('Product added to cart:', cartItem);
    } else {
      console.log('Product out of stock');
      dispatch(setNotification({
        type: 'error',
        message: `${product.name} is out of stock`,
        duration: 3000
      }));
    }
  };

  // Toggle favorite
  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  // Format category name
  const categoryName = product.category?.name || '';
  
  // Format price with discount
  const discountedPrice = product.discount > 0
    ? (product.price - (product.price * product.discount / 100)).toFixed(0)
    : product.price;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.08,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  // Simplified Compact Variant
  if (variant === 'compact') {
    return (
      <motion.div 
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={`group relative rounded-2xl shadow-lg overflow-hidden cursor-pointer backdrop-blur-sm border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/90 border-gray-700/50 hover:shadow-2xl hover:shadow-blue-500/10' 
            : 'bg-white/95 border-white/20 hover:shadow-2xl hover:shadow-blue-500/20'
        }`}
        onClick={goToProductDetails}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative h-40 overflow-hidden">
          <motion.img 
            variants={imageVariants}
            src={product.images && product.images[0] && product.images[0].url ? product.images[0].url : PLACEHOLDER_IMAGE} 
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMAGE;
            }}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Loading shimmer */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
          )}
          
          {/* Favorite button */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg backdrop-blur-sm border border-white/20"
          >
            <AnimatePresence mode="wait">
              {isFavorite ? 
                <motion.div
                  key="filled"
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0.8, rotate: 10 }}
                >
                  <AiFillHeart className="text-red-500" size={16} />
                </motion.div> : 
                <motion.div
                  key="outline"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                >
                  <AiOutlineHeart className="text-gray-600 dark:text-gray-400" size={16} />
                </motion.div>
              }
            </AnimatePresence>
          </motion.button>
          
          {/* Sale badge */}
          {product.discount > 0 && (
            <motion.div 
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: -12 }}
              className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-lg"
            >
              {product.discount}% OFF
            </motion.div>
          )}
          
          {/* Out of stock overlay */}
          {product.countInStock === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
            >
              <span className="text-white font-bold px-4 py-2 bg-red-500 rounded-lg shadow-lg">
                Out of Stock
              </span>
            </motion.div>
          )}
        </div>
        
        <div className="relative p-4">
          <h3 className="text-sm font-semibold truncate mb-2 group-hover:text-blue-600 transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex justify-between items-center">
            <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ৳{discountedPrice}
            </span>
            {product.discount > 0 && (
              <span className="text-xs text-gray-500 line-through">৳{product.price}</span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Default Variant - Enhanced
  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`group relative rounded-3xl shadow-xl overflow-hidden backdrop-blur-sm border transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gray-800/95 border-gray-700/50 hover:shadow-2xl hover:shadow-blue-500/20' 
          : 'bg-white/95 border-white/30 hover:shadow-2xl hover:shadow-blue-500/25'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Product Image */}
      <div 
        className="relative cursor-pointer overflow-hidden" 
        onClick={goToProductDetails}
        style={{ height: '280px' }}
      >
        <motion.img 
          variants={imageVariants}
          src={product.images && product.images[0] && product.images[0].url ? product.images[0].url : PLACEHOLDER_IMAGE} 
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMAGE;
          }}
          onLoad={() => setIsImageLoaded(true)}
        />
        
        {/* Loading shimmer */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
        )}
        
        {/* Out of stock overlay */}
        {product.countInStock === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
          >
            <span className="text-white font-bold px-6 py-3 bg-red-500 rounded-xl shadow-2xl">
              Out of Stock
            </span>
          </motion.div>
        )}
        
        {/* Sale badge */}
        {product.discount > 0 && (
          <motion.div 
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: -12 }}
            className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-2 rounded-xl shadow-lg z-10"
          >
            {product.discount}% OFF
          </motion.div>
        )}
        
        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex flex-col space-y-3">
          <motion.button 
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(e);
            }}
            className={`p-3 rounded-full shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300 ${
              isDarkMode ? 'bg-gray-700/90' : 'bg-white/90'
            }`}
          >
            <AnimatePresence mode="wait">
              {isFavorite ? 
                <motion.div
                  key="filled"
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0.8, rotate: 10 }}
                >
                  <AiFillHeart className="text-red-500" size={20} />
                </motion.div> : 
                <motion.div
                  key="outline"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                >
                  <AiOutlineHeart className="text-gray-600" size={20} />
                </motion.div>
              }
            </AnimatePresence>
          </motion.button>
          
          <motion.button 
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToProductDetails();
            }}
            className={`p-3 rounded-full shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300 ${
              isDarkMode ? 'bg-gray-700/90' : 'bg-white/90'
            }`}
          >
            <AiOutlineEye className="text-gray-600" size={20} />
          </motion.button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="relative p-6">
        {/* Category */}
        <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">
          {categoryName}
        </div>
        
        {/* Product name */}
        <h3 
          className="font-bold text-lg mb-3 cursor-pointer hover:text-blue-600 transition-colors duration-300 line-clamp-2"
          onClick={goToProductDetails}
        >
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center mb-4">
          <StarRating value={product.rating} size="sm" readOnly />
          <span className="text-sm ml-2 text-gray-500 dark:text-gray-400">
            ({product.numReviews || 0})
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center mb-6">
          <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ৳{discountedPrice}
          </span>
          {product.discount > 0 && (
            <span className="ml-3 text-lg text-gray-500 dark:text-gray-400 line-through">
              ৳{product.price}
            </span>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-3">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="button"
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center space-x-2 font-semibold transition-all duration-300 ${
              product.countInStock === 0 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <BsCart2 size={18} />
            <span>{product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </motion.button>
          
          <motion.button 
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="button"
            onClick={goToProductDetails}
            className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
              isDarkMode 
                ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700 text-gray-300' 
                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700'
            }`}
          >
            View
          </motion.button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-1/2 left-4 w-8 h-8 bg-gradient-to-br from-pink-100/30 to-orange-100/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
    </motion.div>
  );
};

export default ProductCard;
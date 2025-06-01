import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiShoppingBag, FiHeart, FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../features/auth/authSlice';

const MobileNavigation = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="grid h-full grid-cols-5">
        {/* Home */}
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center py-2 ${
            isActive('/') ? 'text-primary-600 dark:text-primary-500' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <FiHome size={20} className="mb-1" />
          <span className="text-xs">Home</span>
        </Link>
        
        {/* Categories */}
        <Link 
          to="/categories" 
          className={`flex flex-col items-center justify-center py-2 ${
            isActive('/categories') || isActive('/products') ? 'text-primary-600 dark:text-primary-500' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <FiGrid size={20} className="mb-1" />
          <span className="text-xs">Categories</span>
        </Link>
        
        {/* Shop Button (centered and elevated) */}
        <div className="relative flex items-center justify-center">
          <Link 
            to="/products" 
            className="absolute -top-5 flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full text-white shadow-lg hover:bg-primary-700 transition-colors"
          >
            <FiShoppingBag size={24} />
          </Link>
        </div>
        
        {/* Wishlist */}
        <Link 
          to="/wishlist" 
          className={`flex flex-col items-center justify-center py-2 ${
            isActive('/wishlist') ? 'text-primary-600 dark:text-primary-500' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <FiHeart size={20} className="mb-1" />
          <span className="text-xs">Wishlist</span>
        </Link>
        
        {/* Profile */}
        <Link 
          to={isAuthenticated ? '/user/profile' : '/login'} 
          className={`flex flex-col items-center justify-center py-2 ${
            isActive('/user') || isActive('/login') ? 'text-primary-600 dark:text-primary-500' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <FiUser size={20} className="mb-1" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;

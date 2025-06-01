import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiHome, FiGrid, FiShoppingBag, FiHeart, FiUser } from 'react-icons/fi';
import { selectIsAuthenticated, selectCurrentUser } from '../../features/auth/authSlice';

const MobileNavBar = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };
  
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 md:hidden">
      <div className="grid h-full grid-cols-5">
        {/* Home */}
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center ${
            isActive('/') ? 'text-primary-600 dark:text-primary-500' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <FiHome size={20} className="mb-1" />
          <span className="text-xs">Home</span>
        </Link>
        
        {/* Categories */}
        <Link 
          to="/categories" 
          className={`flex flex-col items-center justify-center ${
            isActive('/categories') ? 'text-primary-600 dark:text-primary-500' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <FiGrid size={20} className="mb-1" />
          <span className="text-xs">Categories</span>
        </Link>
        
        {/* Shop Button (centered and elevated) */}
        <Link 
          to="/products" 
          className="relative flex items-center justify-center"
        >
          <div className="absolute -top-5 flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full text-white shadow-lg">
            <FiShoppingBag size={24} />
          </div>
        </Link>
        
        {/* Wishlist */}
        <Link 
          to="/wishlist" 
          className={`flex flex-col items-center justify-center ${
            isActive('/wishlist') ? 'text-primary-600 dark:text-primary-500' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <FiHeart size={20} className="mb-1" />
          <span className="text-xs">Wishlist</span>
        </Link>
        
        {/* Profile */}
        <Link 
          to={isAuthenticated ? '/user/profile' : '/login'} 
          className={`flex flex-col items-center justify-center ${
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

export default MobileNavBar;

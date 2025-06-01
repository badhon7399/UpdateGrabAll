import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiMenu, FiSun, FiMoon, FiX } from 'react-icons/fi';
import { selectIsAuthenticated, selectCurrentUser, logout } from '../../features/auth/authSlice';
import { selectCartItemsCount } from '../../features/cart/cartSlice';
import { toggleTheme, selectIsDarkMode, setMobileMenuOpen } from '../../features/ui/uiSlice';
import { useLogoutMutation } from '../../features/api/apiSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const cartItemsCount = useSelector(selectCartItemsCount);
  const isDarkMode = useSelector(selectIsDarkMode);
  const [logoutApi] = useLogoutMutation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);
  
  // Handle search
  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };
  
  // Toggle search bar visibility
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    // Focus the search input when it becomes visible
    if (!showSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  // Toggle theme
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  
  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled 
          ? 'bg-white shadow-md dark:bg-gray-800 dark:shadow-gray-900/50' 
          : 'bg-white dark:bg-gray-800'
      }`}
    >
      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        {/* Mobile Header - only visible on mobile */}
        <div className="flex items-center justify-between md:hidden">
          {/* Left: Mobile menu dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Menu"
            >
              <FiMenu size={24} />
            </button>
          </div>
          
          {/* Center: Logo and name */}
          <Link to="/" className="flex items-center mx-auto">
            <img src="/logo.svg" alt="GrabAll" className="h-8 w-auto" />
            <span className="text-lg font-bold text-primary-600 dark:text-primary-500 ml-2">GrabAll</span>
          </Link>
          
          {/* Right: Search and Cart buttons */}
          <div className="flex items-center space-x-3">
            {/* Search button */}
            <button
              onClick={toggleSearch}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Search"
            >
              <FiSearch size={22} />
            </button>
          
            {/* Cart button */}
            <Link
              to="/cart"
              className="relative text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Shopping cart"
            >
              <FiShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        
        {/* Desktop Header - only visible on desktop */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="GrabAll" className="h-10 w-auto" />
            <span className="text-xl font-bold text-primary-600 dark:text-primary-500 ml-2">GrabAll</span>
          </Link>
          
          {/* Main Navigation - Centered */}
          <nav className="flex space-x-6 mx-auto">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium dark:text-gray-300 dark:hover:text-primary-500">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium dark:text-gray-300 dark:hover:text-primary-500">
              Shop
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-primary-600 font-medium dark:text-gray-300 dark:hover:text-primary-500">
                Admin
              </Link>
            )}
            <Link to="/about-us" className="text-gray-700 hover:text-primary-600 font-medium dark:text-gray-300 dark:hover:text-primary-500">
              About us
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 font-medium dark:text-gray-300 dark:hover:text-primary-500">
              Contact
            </Link>
          </nav>
          
          {/* Desktop Actions */}
          <div className="flex items-center space-x-5">
            {/* User account */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                aria-label="User account"
              >
                <FiUser size={22} />
              </button>
            </div>
            
            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Shopping cart"
            >
              <FiShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {/* Search button that opens search input */}
            <button
              onClick={toggleSearch}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Search"
            >
              <FiSearch size={22} />
            </button>
            
            {/* Theme toggle */}
            <button
              onClick={handleToggleTheme}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Dropdown Menu - shared between mobile and desktop */}
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className={`absolute mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 ${
            isMobile ? 'left-4 top-16 w-64' : 'right-4 md:right-16 top-16 w-48'
          }`}
        >
          {/* Mobile only navigation links */}
          <div className="md:hidden">
            <Link 
              to="/" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setShowDropdown(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setShowDropdown(false)}
            >
              Shop
            </Link>
            <Link 
              to="/categories" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setShowDropdown(false)}
            >
              Categories
            </Link>
            <Link 
              to="/about-us" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setShowDropdown(false)}
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setShowDropdown(false)}
            >
              Contact
            </Link>
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
          </div>
          
          {/* Common user account options */}
          {!isAuthenticated ? (
            <>
              <Link 
                to="/login" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => setShowDropdown(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => setShowDropdown(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                {user?.name || user?.email}
              </div>
              <Link 
                to="/user/profile" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => setShowDropdown(false)}
              >
                Profile
              </Link>
              <Link 
                to="/user/orders" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => setShowDropdown(false)}
              >
                Orders
              </Link>
              <Link 
                to="/wishlist" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => setShowDropdown(false)}
              >
                Wishlist
              </Link>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin/dashboard" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setShowDropdown(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <button 
                onClick={() => {
                  setShowDropdown(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          )}
          
          {/* Mobile-only theme toggle */}
          <div className="md:hidden">
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            <button 
              onClick={() => {
                setShowDropdown(false);
                handleToggleTheme();
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <>
                  <FiSun size={16} className="mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <FiMoon size={16} className="mr-2" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Search bar - Visible when search is clicked */}
      {showSearch && (
        <div className="container mx-auto px-4 pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full py-2 pl-4 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="absolute right-0 top-0 h-full flex items-center">
              <button
                type="button"
                onClick={toggleSearch}
                className="h-full px-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Close search"
              >
                <FiX size={20} />
              </button>
              <button
                type="submit"
                className="h-full px-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;

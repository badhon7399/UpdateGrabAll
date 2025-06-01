import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { selectIsDarkMode } from '../features/ui/uiSlice';
import { Link } from 'react-router-dom';

const AuthLayout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isDarkMode = useSelector(selectIsDarkMode);
  const location = useLocation();
  
  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    // Redirect to the page they were trying to access or to homepage
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Auth header */}
      <header className="py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-500">GrabAll</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Shop
            </Link>
          </div>
        </div>
      </header>
      
      {/* Auth content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      
      {/* Auth footer */}
      <footer className="py-4 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} GrabAll. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;

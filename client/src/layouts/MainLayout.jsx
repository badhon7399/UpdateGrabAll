import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsDarkMode } from '../features/ui/uiSlice';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MobileNavigation from '../components/layout/MobileNavigation';

const MainLayout = () => {
  const isDarkMode = useSelector(selectIsDarkMode);
  
  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
      
      {/* Mobile Navigation - Only visible on small screens */}
      <MobileNavigation />
    </div>
  );
};

export default MainLayout;

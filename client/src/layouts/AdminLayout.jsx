import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAdmin, selectCurrentUser } from '../features/auth/authSlice';
import { selectIsDarkMode, toggleSidebar, setSidebarOpen } from '../features/ui/uiSlice';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AdminLayout = () => {
  const isAdmin = useSelector(selectIsAdmin);
  const user = useSelector(selectCurrentUser);
  const isDarkMode = useSelector(selectIsDarkMode);
  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  
  // Check if user is authenticated and admin
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        dispatch(setSidebarOpen(false));
      } else {
        dispatch(setSidebarOpen(true));
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);
  
  useEffect(() => {
    if (window.innerWidth < 1024) {
      dispatch(setSidebarOpen(false));
    }
  }, [location.pathname, dispatch]);
  
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }
  
  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

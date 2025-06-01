import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiMenu, FiBell, FiSun, FiMoon, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toggleTheme, selectIsDarkMode, setSidebarOpen, selectSidebarOpen } from '../../features/ui/uiSlice';
import { selectCurrentUser, logout } from '../../features/auth/authSlice';
import { useLogoutMutation } from '../../features/api/apiSlice';

const AdminHeader = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);
  const user = useSelector(selectCurrentUser);
  const sidebarOpen = useSelector(selectSidebarOpen);
  const [logoutApi] = useLogoutMutation();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  
  const handleToggleSidebar = () => {
    dispatch(setSidebarOpen(!sidebarOpen));
  };
  
  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  // Mock notifications
  const notifications = [
    {
      id: 1,
      message: 'New order #1234 received',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      message: 'Product "Smartphone X" is low in stock',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      message: 'User feedback received for order #1230',
      time: '3 hours ago',
      read: true,
    },
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={handleToggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <FiMenu size={20} />
          </button>
          <div className="flex items-center ml-2">
            <img src="/logo.svg" alt="GrabAll" className="h-8 w-auto hidden lg:block" />
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              <span className="lg:ml-2">GrabAll Admin</span>
            </h1>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Theme toggle */}
          <button
            onClick={handleToggleTheme}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 relative"
              aria-label="Notifications"
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                  <button className="text-sm text-primary-600 dark:text-primary-500 hover:underline">
                    Mark all as read
                  </button>
                </div>
                
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          notification.read ? 'opacity-70' : 'bg-blue-50 dark:bg-blue-900/20'
                        }`}
                      >
                        <p className="text-sm text-gray-800 dark:text-white">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      No notifications
                    </div>
                  )}
                </div>
                
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/admin/notifications"
                    className="text-sm text-primary-600 dark:text-primary-500 hover:underline"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <FiUser size={18} />
                )}
              </div>
              <span className="hidden md:block text-sm font-medium">{user?.name}</span>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
                
                <Link
                  to="/admin/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setShowDropdown(false)}
                >
                  <div className="flex items-center">
                    <FiUser size={16} className="mr-2" />
                    Profile
                  </div>
                </Link>
                
                <Link
                  to="/admin/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setShowDropdown(false)}
                >
                  <div className="flex items-center">
                    <FiSettings size={16} className="mr-2" />
                    Settings
                  </div>
                </Link>
                
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <FiLogOut size={16} className="mr-2" />
                    Logout
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

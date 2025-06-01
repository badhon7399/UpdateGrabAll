import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiHome, 
  FiBox, 
  FiUsers, 
  FiShoppingBag, 
  FiImage, 
  FiBarChart2, 
  FiSettings,
  FiChevronLeft,
  FiLogOut,
  FiGrid
} from 'react-icons/fi';
import { selectSidebarOpen, setSidebarOpen } from '../../features/ui/uiSlice';
import { logout } from '../../features/auth/authSlice';
import { useLogoutMutation } from '../../features/api/apiSlice';

const AdminSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(selectSidebarOpen);
  const [logoutApi] = useLogoutMutation();
  
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };
  
  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const toggleSidebar = () => {
    dispatch(setSidebarOpen(!sidebarOpen));
  };
  
  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } lg:relative`}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/admin/dashboard" className="flex items-center">
          {sidebarOpen ? (
            <span className="text-xl font-bold text-primary-600 dark:text-primary-500">GrabAll Admin</span>
          ) : (
            <span className="text-xl font-bold text-primary-600 dark:text-primary-500">GA</span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 lg:hidden"
        >
          <FiChevronLeft size={20} className={`transform transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
        </button>
      </div>
      
      {/* Sidebar content */}
      <div className="py-4 overflow-y-auto">
        <ul className="space-y-2 px-3">
          <li>
            <Link
              to="/admin/dashboard"
              className={`flex items-center p-3 rounded-md transition-colors ${
                isActive('/admin/dashboard')
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-500'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <FiHome size={20} />
              {sidebarOpen && <span className="ml-3">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/products"
              className={`flex items-center p-3 rounded-md transition-colors ${
                isActive('/admin/products')
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-500'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <FiBox size={20} />
              {sidebarOpen && <span className="ml-3">Products</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/categories"
              className={`flex items-center p-3 rounded-md transition-colors ${
                isActive('/admin/categories')
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-500'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <FiGrid size={20} />
              {sidebarOpen && <span className="ml-3">Categories</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/orders"
              className={`flex items-center p-3 rounded-md transition-colors ${
                isActive('/admin/orders')
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-500'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <FiShoppingBag size={20} />
              {sidebarOpen && <span className="ml-3">Orders</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className={`flex items-center p-3 rounded-md transition-colors ${
                isActive('/admin/users')
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-500'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <FiUsers size={20} />
              {sidebarOpen && <span className="ml-3">Users</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/banners"
              className={`flex items-center p-3 rounded-md transition-colors ${
                isActive('/admin/banners')
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-500'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <FiImage size={20} />
              {sidebarOpen && <span className="ml-3">Banners</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/analytics"
              className={`flex items-center p-3 rounded-md transition-colors ${
                isActive('/admin/analytics')
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-500'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <FiBarChart2 size={20} />
              {sidebarOpen && <span className="ml-3">Analytics</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/settings"
              className={`flex items-center p-3 rounded-md transition-colors ${
                isActive('/admin/settings')
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-500'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <FiSettings size={20} />
              {sidebarOpen && <span className="ml-3">Settings</span>}
            </Link>
          </li>
        </ul>
        
        {/* Sidebar footer */}
        <div className="mt-auto pt-4 px-3 border-t border-gray-200 dark:border-gray-700 mt-6">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
          
          <Link
            to="/"
            className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors mt-2"
          >
            <FiHome size={20} />
            {sidebarOpen && <span className="ml-3">Back to Site</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;

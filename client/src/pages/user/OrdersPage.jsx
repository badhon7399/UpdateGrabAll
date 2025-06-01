import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import OrdersList from '../../components/profile/OrdersList';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const OrdersPage = () => {
  const user = useSelector(selectCurrentUser);
  const isDarkMode = useSelector(selectIsDarkMode);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  if (!user) return <LoadingSpinner fullScreen />;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <OrdersList isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

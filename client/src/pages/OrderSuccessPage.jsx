import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../features/ui/uiSlice';

const OrderSuccessPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Get orderId from URL params or localStorage as fallback
  const { orderId: urlOrderId } = useParams();
  const storedOrderId = localStorage.getItem('lastOrderId');
  const orderId = urlOrderId || storedOrderId || 'unknown';
  
  const isDarkMode = useSelector(selectIsDarkMode);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Validate that we have a proper orderId or redirect to home after a timeout
    if (orderId === 'unknown') {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    // Mark page as loaded after a small delay to ensure component is fully mounted
    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(loadTimer);
  }, [orderId, navigate]);
  
  // Redirect to 404 if there's an error
  if (error) {
    return <Navigate to="/404" />;
  }
  
  // Show loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4">Loading order information...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-16">
        <div className={`max-w-3xl mx-auto rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mt-6 mb-3">Order Placed Successfully!</h1>
            <p className="text-lg">Thank you for your order. We've received your order and will begin processing it soon.</p>
            {orderId !== 'unknown' && <p className="text-md mt-2">Order ID: {orderId}</p>}
          </div>
          
          <div className="border-t border-b py-6 my-6 grid grid-cols-1 gap-4">
            <div className="mb-4">
              <h2 className="font-semibold text-xl mb-2">Next Steps</h2>
              <p>Your order is now being processed. You will receive an email confirmation shortly.</p>
            </div>
            
            <div className="mb-4">
              <h2 className="font-semibold text-xl mb-2">Order Processing</h2>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Order verification</li>
                <li>Payment processing</li>
                <li>Packaging</li>
                <li>Shipping</li>
                <li>Delivery</li>
              </ol>
            </div>
            
            <div className="mb-4">
              <h2 className="font-semibold text-xl mb-2">Need Help?</h2>
              <p>If you have any questions about your order, please contact our customer support:</p>
              <p className="mt-2">
                <a href="mailto:support@graball.com" className="text-blue-500">support@graball.com</a> | 
                <span className="ml-2">+88 01234 567890</span>
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link 
              to="/products" 
              className={`px-6 py-2 rounded-md font-medium ${
                isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition duration-300`}
            >
              Continue Shopping
            </Link>
            <Link 
              to="/" 
              className={`px-6 py-2 rounded-md font-medium ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              } transition duration-300`}
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

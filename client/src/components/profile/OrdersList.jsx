import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';

const OrdersList = ({ orders = [] }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  
  if (!orders || orders.length === 0) {
    return (
      <div className={`p-6 rounded-lg text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <p className="mb-4">You haven't placed any orders yet.</p>
        <Link 
          to="/products" 
          className="text-primary-600 hover:underline"
        >
          Browse products
        </Link>
      </div>
    );
  }
  
  // Function to get status badge class
  const getStatusBadgeClass = (status) => {
    const baseClass = 'px-2 py-1 rounded text-xs font-medium';
    
    switch (status) {
      case 'processing':
        return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`;
      case 'shipped':
        return `${baseClass} bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300`;
      case 'delivered':
        return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
      case 'cancelled':
        return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`;
    }
  };
  
  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div 
          key={order._id} 
          className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {/* Order information */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-medium">Order #{order._id.slice(-8)}</h3>
                <span className={getStatusBadgeClass(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Placed on {formatDate(order.createdAt)}
              </p>
              
              <div className="mt-3">
                <span className={`block font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Total: ৳{order.totalPrice}
                </span>
                <span className={`block text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              
              {/* Payment method */}
              <div className="mt-2">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Payment: {order.paymentMethod}
                </span>
              </div>
            </div>
            
            {/* Order preview */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                {/* Show thumbnail images of first 3 products */}
                {order.orderItems.slice(0, 3).map((item, index) => (
                  <div 
                    key={index} 
                    className="w-12 h-12 rounded-md overflow-hidden border dark:border-gray-700"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                
                {/* Show count of additional items if more than 3 */}
                {order.orderItems.length > 3 && (
                  <div className={`w-12 h-12 rounded-md flex items-center justify-center ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <span className="text-xs font-medium">+{order.orderItems.length - 3}</span>
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2">
                <Link
                  to={`/orders/${order._id}`}
                  className="px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
                >
                  View Details
                </Link>
                
                {order.status === 'processing' && (
                  <button
                    className={`px-3 py-1 text-sm rounded-md border ${
                      isDarkMode 
                        ? 'border-gray-600 hover:bg-gray-700' 
                        : 'border-gray-300 hover:bg-gray-100'
                    } transition-colors`}
                  >
                    Cancel Order
                  </button>
                )}
                
                {order.status === 'delivered' && !order.isReviewed && (
                  <Link
                    to={`/orders/${order._id}?review=true`}
                    className={`px-3 py-1 text-sm rounded-md ${
                      isDarkMode 
                        ? 'bg-green-700 hover:bg-green-600' 
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white transition-colors`}
                  >
                    Write Review
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;

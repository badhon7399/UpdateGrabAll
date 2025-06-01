import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetOrderQuery, useCancelOrderMutation } from '../features/api/apiSlice';
import { selectIsDarkMode } from '../features/ui/uiSlice';
import { setNotification } from '../features/ui/uiSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);
  
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Fetch order details
  const { 
    data: order, 
    isLoading, 
    error, 
    refetch 
  } = useGetOrderQuery(orderId);
  
  // Cancel order mutation
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  
  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      dispatch(setNotification({
        type: 'error',
        message: 'Please provide a reason for cancellation',
        duration: 3000
      }));
      return;
    }
    
    try {
      await cancelOrder({ 
        id: orderId, 
        reason: cancelReason 
      }).unwrap();
      
      dispatch(setNotification({
        type: 'success',
        message: 'Order cancelled successfully',
        duration: 5000
      }));
      
      setShowCancelModal(false);
      refetch();
    } catch (err) {
      dispatch(setNotification({
        type: 'error',
        message: err.data?.message || 'Failed to cancel order',
        duration: 5000
      }));
    }
  };
  
  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Function to get status badge class
  const getStatusBadgeClass = (status) => {
    const baseClass = 'px-3 py-1 rounded-full text-sm font-medium';
    
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
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`container mx-auto px-4 py-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <h2 className="text-2xl font-bold mb-4">Error Loading Order</h2>
        <p className="mb-8">
          We couldn't load the order details. Please try again later.
        </p>
        <button
          onClick={() => navigate(-1)}
          className={`px-6 py-2 rounded-md ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Go Back
        </button>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className={`container mx-auto px-4 py-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="mb-8">
          The order you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/profile"
          className={`px-6 py-2 rounded-md ${
            isDarkMode ? 'bg-primary-600 hover:bg-primary-700' : 'bg-primary-500 hover:bg-primary-600'
          } text-white`}
        >
          View All Orders
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Order #{order._id.slice(-8)}</h1>
              <span className={getStatusBadgeClass(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            {order.status === 'processing' && (
              <button
                onClick={() => setShowCancelModal(true)}
                className={`px-4 py-2 rounded-md ${
                  isDarkMode 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-red-500 hover:bg-red-600'
                } text-white`}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
        
        {/* Order content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order items and details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order items */}
            <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className="text-xl font-semibold">Order Items</h2>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="p-4 flex">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <h3 className="font-medium">
                          <Link 
                            to={`/products/${item.product}`} 
                            className="hover:text-primary-600"
                          >
                            {item.name}
                          </Link>
                        </h3>
                        <p className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex items-end justify-between mt-1 text-sm">
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                          {item.variant && `${item.variant.name} • `}
                          Qty: {item.quantity}
                        </p>
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                          ৳{item.price} each
                        </p>
                      </div>
                      
                      {/* Review button for delivered orders */}
                      {order.status === 'delivered' && !item.isReviewed && (
                        <div className="mt-2">
                          <Link
                            to={`/products/${item.product}?review=true`}
                            className="text-sm text-primary-600 hover:underline"
                          >
                            Write a Review
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Shipping details */}
            <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className="text-xl font-semibold">Shipping Details</h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.division}</p>
                  <p>{order.shippingAddress.phone}</p>
                </div>
                
                {/* Delivery info if shipped */}
                {order.status !== 'processing' && order.status !== 'cancelled' && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Delivery Information</h3>
                    {order.trackingNumber ? (
                      <div>
                        <p className="mb-1">
                          <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                        </p>
                        <p className="mb-1">
                          <span className="font-medium">Courier:</span> {order.shippingCarrier || 'GrabAll Delivery'}
                        </p>
                        {order.estimatedDelivery && (
                          <p>
                            <span className="font-medium">Estimated Delivery:</span> {formatDate(order.estimatedDelivery)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                        Tracking information will be provided soon.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Order timeline */}
            {order.statusUpdates && order.statusUpdates.length > 0 && (
              <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
                <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h2 className="text-xl font-semibold">Order Timeline</h2>
                </div>
                <div className="p-6">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute top-0 bottom-0 left-5 w-px bg-gray-300 dark:bg-gray-600"></div>
                    
                    {/* Timeline events */}
                    <div className="space-y-8">
                      {order.statusUpdates.map((update, index) => (
                        <div key={index} className="relative flex items-start">
                          <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            index === 0 
                              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' 
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {update.status === 'ordered' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            )}
                            {update.status === 'processing' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                              </svg>
                            )}
                            {update.status === 'shipped' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                              </svg>
                            )}
                            {update.status === 'delivered' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {update.status === 'cancelled' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-14">
                            <h4 className="font-medium">
                              {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {new Date(update.timestamp).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            {update.note && (
                              <p className="mt-1">{update.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 sticky top-4`}>
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className={`pb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between mb-1">
                    <span>Items Total</span>
                    <span>৳{order.itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Shipping</span>
                    {order.shippingPrice === 0 ? (
                      <span className="text-green-500">Free</span>
                    ) : (
                      <span>৳{order.shippingPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Tax (15% VAT)</span>
                    <span>৳{order.taxPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>৳{order.totalPrice.toFixed(2)}</span>
                </div>
                
                <div className={`pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Payment Method</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Payment Status</span>
                    <span className={
                      order.isPaid 
                        ? 'text-green-500' 
                        : order.status === 'cancelled' 
                          ? 'text-red-500' 
                          : 'text-yellow-500'
                    }>
                      {order.isPaid ? 'Paid' : order.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                    </span>
                  </div>
                </div>
                
                {/* Download invoice button */}
                {(order.status === 'shipped' || order.status === 'delivered') && (
                  <div className="mt-6">
                    <button
                      className={`w-full py-2 rounded-md ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      } transition-colors flex items-center justify-center`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Invoice
                    </button>
                  </div>
                )}
                
                {/* Customer support */}
                <div className={`mt-6 p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <h3 className="font-medium mb-2">Need Help?</h3>
                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    If you have any questions or concerns about your order, please contact our customer support.
                  </p>
                  <button
                    className="text-primary-600 hover:underline text-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowCancelModal(false)}
            ></div>
            
            {/* Modal */}
            <div className={`relative inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium" id="modal-title">
                      Cancel Order
                    </h3>
                    <div className="mt-2">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Are you sure you want to cancel this order? This action cannot be undone.
                      </p>
                      <div className="mt-4">
                        <label htmlFor="cancel-reason" className="block text-sm font-medium mb-1">
                          Reason for cancellation
                        </label>
                        <select
                          id="cancel-reason"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className={`w-full rounded-md px-3 py-2 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-700'
                          } border focus:ring-primary-500 focus:border-primary-500`}
                        >
                          <option value="">Select a reason</option>
                          <option value="Changed my mind">Changed my mind</option>
                          <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                          <option value="Ordered by mistake">Ordered by mistake</option>
                          <option value="Shipping will take too long">Shipping will take too long</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  disabled={isCancelling}
                  onClick={handleCancelOrder}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    isCancelling ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowCancelModal(false)}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                  } shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;

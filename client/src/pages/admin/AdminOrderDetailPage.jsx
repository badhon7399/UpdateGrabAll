import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  useGetOrderByIdQuery, 
  useUpdateOrderStatusMutation,
  useUpdateOrderPaymentStatusMutation 
} from '../../features/api/apiSlice';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const isDarkMode = useSelector(selectIsDarkMode);
  
  // State for status updates
  const [statusNote, setStatusNote] = useState('');
  
  // Fetch order details
  const { data: order, isLoading, error, refetch } = useGetOrderByIdQuery(id);
  
  // Mutations for updating order
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();
  const [updateOrderPaymentStatus, { isLoading: isUpdatingPayment }] = useUpdateOrderPaymentStatusMutation();
  
  // Handle order status update
  const handleStatusChange = async (newStatus) => {
    if (window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
      try {
        await updateOrderStatus({ 
          id, 
          status: newStatus,
          note: statusNote
        }).unwrap();
        
        // Clear note after successful update
        setStatusNote('');
        
        // Refetch order to get latest data
        refetch();
        
        alert('Order status updated successfully');
      } catch (err) {
        alert(`Failed to update order status: ${err.message}`);
      }
    }
  };
  
  // Handle payment status update
  const handlePaymentStatusChange = async (isPaid) => {
    if (window.confirm(`Are you sure you want to mark this order as ${isPaid ? 'paid' : 'unpaid'}?`)) {
      try {
        await updateOrderPaymentStatus({ 
          id, 
          isPaid
        }).unwrap();
        
        // Refetch order to get latest data
        refetch();
        
        alert(`Order marked as ${isPaid ? 'paid' : 'unpaid'} successfully`);
      } catch (err) {
        alert(`Failed to update payment status: ${err.message}`);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800'}`}>
        <h2 className="text-lg font-semibold mb-2">Error Loading Order</h2>
        <p>Failed to load order details. Please try again later.</p>
      </div>
    );
  }
  
  // Helper function to get appropriate status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Order #{order._id.slice(-8)}
          </h1>
          <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2">
          <Link
            to={`/admin/orders`}
            className={`px-4 py-2 rounded-md ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors text-sm`}
          >
            Back to Orders
          </Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm"
          >
            Print Order
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order Status</h2>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium mb-1">
                Change Status
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusChange('processing')}
                  disabled={order.status === 'processing' || isUpdatingStatus}
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'processing'
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  } bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`}
                >
                  Processing
                </button>
                <button
                  onClick={() => handleStatusChange('shipped')}
                  disabled={order.status === 'shipped' || isUpdatingStatus}
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'shipped'
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  } bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`}
                >
                  Shipped
                </button>
                <button
                  onClick={() => handleStatusChange('delivered')}
                  disabled={order.status === 'delivered' || isUpdatingStatus}
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'delivered'
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  } bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`}
                >
                  Delivered
                </button>
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={order.status === 'cancelled' || isUpdatingStatus}
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'cancelled'
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  } bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`}
                >
                  Cancelled
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="statusNote" className="block text-sm font-medium mb-1">
                Status Update Note (optional)
              </label>
              <textarea
                id="statusNote"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Add a note about this status change..."
                rows="2"
                className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              ></textarea>
            </div>
            
            {/* Status History */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Status History</h3>
                <div className={`border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-md overflow-hidden`}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Note</th>
                          <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">By</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {order.statusHistory.map((history, index) => (
                          <tr key={index} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                            <td className="px-4 py-2 whitespace-nowrap text-xs">
                              {new Date(history.date).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(history.status)}`}>
                                {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-xs">
                              {history.note || '-'}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs">
                              {history.by || 'System'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Payment Information */}
          <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Payment Information</h2>
              <span className={`px-3 py-1 rounded-full text-sm ${
                order.isPaid
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {order.isPaid ? 'Paid' : 'Unpaid'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Payment Method
                </p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              
              {order.isPaid && (
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Paid At
                  </p>
                  <p className="font-medium">
                    {new Date(order.paidAt).toLocaleString()}
                  </p>
                </div>
              )}
              
              {order.paymentResult && (
                <>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Transaction ID
                    </p>
                    <p className="font-medium">{order.paymentResult.id || 'N/A'}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Status
                    </p>
                    <p className="font-medium">{order.paymentResult.status || 'N/A'}</p>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              {order.isPaid ? (
                <button
                  onClick={() => handlePaymentStatusChange(false)}
                  disabled={isUpdatingPayment}
                  className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors text-sm"
                >
                  Mark as Unpaid
                </button>
              ) : (
                <button
                  onClick={() => handlePaymentStatusChange(true)}
                  disabled={isUpdatingPayment}
                  className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors text-sm"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
          
          {/* Order Items */}
          <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className={`border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-md overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Product</th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {order.orderItems.map((item) => (
                      <tr key={item._id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-12 w-12 rounded-md object-cover"
                              />
                            </div>
                            <div className="ml-3">
                              <Link
                                to={`/admin/products/edit/${item.product}`}
                                className="text-sm font-medium hover:text-primary-600"
                              >
                                {item.name}
                              </Link>
                              {item.sku && (
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  SKU: {item.sku}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          ৳{item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-right">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <td colSpan="3" className="px-4 py-2 text-sm text-right font-medium">
                        Subtotal:
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-medium">
                        ৳{order.itemsPrice.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="px-4 py-2 text-sm text-right font-medium">
                        Shipping:
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-medium">
                        {order.shippingPrice === 0 ? (
                          <span className="text-green-600 dark:text-green-400">Free</span>
                        ) : (
                          `৳${order.shippingPrice.toFixed(2)}`
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="px-4 py-2 text-sm text-right font-medium">
                        Tax (15% VAT):
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-medium">
                        ৳{order.taxPrice.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="px-4 py-2 text-sm text-right font-bold">
                        Total:
                      </td>
                      <td className="px-4 py-2 text-right font-bold">
                        ৳{order.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Customer Information Column */}
        <div className="space-y-6">
          {/* Customer Details */}
          <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            
            {order.user ? (
              <div className="mb-4">
                <p className="font-medium">{order.user.name}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <a href={`mailto:${order.user.email}`} className="hover:underline">
                    {order.user.email}
                  </a>
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Customer since: {new Date(order.user.createdAt).toLocaleDateString()}
                </p>
                
                <div className="mt-3">
                  <Link
                    to={`/admin/users/${order.user._id}`}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    View Customer Profile
                  </Link>
                </div>
              </div>
            ) : (
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Guest Checkout
              </p>
            )}
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h3 className="text-sm font-medium mb-2">Contact Information</h3>
              <p className="text-sm">{order.shippingAddress?.fullName}</p>
              <p className="text-sm">
                <a href={`tel:${order.shippingAddress?.phone}`} className="hover:underline">
                  {order.shippingAddress?.phone}
                </a>
              </p>
              <p className="text-sm">
                <a href={`mailto:${order.shippingAddress?.email || order.user?.email}`} className="hover:underline">
                  {order.shippingAddress?.email || order.user?.email}
                </a>
              </p>
            </div>
          </div>
          
          {/* Shipping Address */}
          <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div>
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.division}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
            
            {order.isDelivered ? (
              <div className="mt-4 p-3 rounded-md bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <p className="text-sm font-medium">
                  Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className="mt-4 p-3 rounded-md bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                <p className="text-sm font-medium">Not Delivered</p>
              </div>
            )}
          </div>
          
          {/* Customer Notes */}
          {order.notes && (
            <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
              <h2 className="text-xl font-semibold mb-4">Customer Notes</h2>
              <p className="text-sm">{order.notes}</p>
            </div>
          )}
          
          {/* Admin Actions */}
          <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => window.print()}
                className="w-full px-4 py-2 text-sm rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Print Order
              </button>
              <button
                className="w-full px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Generate Invoice
              </button>
              <a
                href={`mailto:${order.user?.email}?subject=Your Order #${order._id.slice(-8)}`}
                className="block w-full px-4 py-2 text-sm text-center rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Email Customer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;

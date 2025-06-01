import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useGetOrdersQuery } from '../../features/api/apiSlice';
import LoadingSpinner from '../ui/LoadingSpinner';

const UserStats = ({ user, isDarkMode }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    recentOrders: [],
    accountCreated: user?.createdAt || new Date().toISOString(),
    wishlistCount: user?.wishlist?.length || 0
  });

  // Fetch user orders with RTK Query
  const { 
    data: ordersData, 
    isLoading, 
    isError 
  } = useGetOrdersQuery({ limit: 10, sort: '-createdAt' });

  // Process order data when it's available
  useEffect(() => {
    if (ordersData && ordersData.orders) {
      // Calculate stats from real order data
      const totalSpent = ordersData.orders.reduce(
        (sum, order) => sum + (order.totalAmount || 0), 
        0
      );
      
      // Get the 3 most recent orders for display
      const recentOrders = ordersData.orders.slice(0, 3).map(order => ({
        id: order._id,
        date: order.createdAt,
        total: order.totalAmount,
        status: order.status
      }));
      
      setStats({
        totalOrders: ordersData.totalOrders || ordersData.orders.length,
        totalSpent,
        recentOrders,
        accountCreated: user?.createdAt || new Date().toISOString(),
        wishlistCount: user?.wishlist?.length || 0
      });
    }
  }, [ordersData, user]);

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium">Account Statistics</h3>
      
      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm font-medium mb-1">Account Created</p>
          <p className="text-2xl font-bold">{formatDate(stats.accountCreated)}</p>
        </div>
        
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm font-medium mb-1">Total Orders</p>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm font-medium mb-1">Total Spent</p>
          <p className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</p>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium">Recent Orders</h4>
          <Link
            to="/user/orders"
            className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
          >
            View All Orders
          </Link>
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        )}
        
        {/* Error state */}
        {isError && (
          <div className={`text-center py-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className="text-red-500">Error loading order data. Please try again later.</p>
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && !isError && stats.recentOrders.length === 0 && (
          <div className={`text-center py-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p>No orders yet</p>
          </div>
        )}
        
        {/* Orders table */}
        {!isLoading && !isError && stats.recentOrders.length > 0 && (
          <div className={`rounded-lg overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {stats.recentOrders.map(order => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/user/orders/${order.id}`}
                        className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
                      >
                        #{order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'processing'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Other Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-medium mb-4">Wishlist</h4>
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className="text-sm mb-2">You have <span className="font-bold">{stats.wishlistCount}</span> items in your wishlist</p>
            <Link
              to="/user/wishlist"
              className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
            >
              View Wishlist →
            </Link>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-4">Shipping Addresses</h4>
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className="text-sm mb-2">Manage your shipping addresses</p>
            <Link
              to="/user/addresses"
              className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
            >
              View Addresses →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;

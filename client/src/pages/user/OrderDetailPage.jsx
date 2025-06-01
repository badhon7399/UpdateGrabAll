import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { formatDate, formatCurrency } from '../../utils/formatters';

const OrderDetailPage = () => {
  const { id } = useParams();
  const user = useSelector(selectCurrentUser);
  const isDarkMode = useSelector(selectIsDarkMode);
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        // This would be replaced with an actual API call
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulating API call
        
        // Mock order data - in a real app, this would come from your API
        const mockOrder = {
          _id: id,
          orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
          createdAt: new Date().toISOString(),
          status: 'processing',
          paymentMethod: 'Credit Card',
          paymentStatus: 'paid',
          shippingAddress: {
            fullName: user.name,
            address: '123 Main St',
            city: 'Anytown',
            postalCode: '12345',
            country: 'Bangladesh'
          },
          items: [
            {
              product: {
                _id: 'prod1',
                name: 'Wireless Headphones',
                image: 'https://picsum.photos/seed/product-order-1/150/150',
                price: 129.99
              },
              quantity: 1,
              price: 129.99
            },
            {
              product: {
                _id: 'prod2',
                name: 'Smart Watch',
                image: 'https://picsum.photos/seed/product-order-1/150/150',
                price: 249.99
              },
              quantity: 1,
              price: 249.99
            }
          ],
          subtotal: 379.98,
          shippingPrice: 15.00,
          taxPrice: 38.00,
          totalPrice: 432.98
        };
        
        setOrder(mockOrder);
      } catch (error) {
        toast.error('Failed to load order details');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchOrderDetails();
    }
  }, [id, user]);

  if (!user) return <LoadingSpinner fullScreen />;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
            <p className="mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link
              to="/user/orders"
              className={`inline-block px-6 py-3 rounded-md ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-medium transition-colors`}
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <Link
            to="/user/orders"
            className={`px-4 py-2 rounded-md ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors`}
          >
            Back to Orders
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order #{order.orderNumber}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
            </div>
            
            <p className="text-sm mb-4">
              Placed on {formatDate(order.createdAt)}
            </p>
            
            <div className="border-t border-b border-gray-200 py-4 mb-4">
              <h3 className="font-medium mb-2">Items</h3>
              
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center py-3 border-b border-gray-200 last:border-b-0">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="mt-1 text-sm">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <p>Subtotal</p>
                <p>{formatCurrency(order.subtotal)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Shipping</p>
                <p>{formatCurrency(order.shippingPrice)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Tax</p>
                <p>{formatCurrency(order.taxPrice)}</p>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-gray-200">
                <p>Total</p>
                <p>{formatCurrency(order.totalPrice)}</p>
              </div>
            </div>
          </div>
          
          {/* Order Info */}
          <div className="space-y-6">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <h3 className="font-semibold text-lg mb-4">Shipping Information</h3>
              <address className="not-italic">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </div>
            
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <h3 className="font-semibold text-lg mb-4">Payment Information</h3>
              <p>
                <span className="font-medium">Method:</span> {order.paymentMethod}
              </p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span className={
                  order.paymentStatus === 'paid'
                    ? 'text-green-500'
                    : 'text-yellow-500'
                }>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </p>
            </div>
            
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <h3 className="font-semibold text-lg mb-4">Need Help?</h3>
              <p className="mb-4 text-sm">
                If you have any questions or concerns about your order, please contact our customer support.
              </p>
              <button
                className={`w-full py-2 rounded-md ${
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors`}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;

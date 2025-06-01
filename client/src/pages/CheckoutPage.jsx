import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  selectCartItems, 
  selectCartTotalAmount,
  saveShippingAddress,
  savePaymentMethod,
  clearCart
} from '../features/cart/cartSlice';
import { 
  selectCurrentUser, 
  selectIsAuthenticated 
} from '../features/auth/authSlice';
import { selectIsDarkMode, setNotification } from '../features/ui/uiSlice';
import { useCreateOrderMutation } from '../features/api/apiSlice';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import AddressForm from '../components/checkout/AddressForm';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';
import OrderSummary from '../components/checkout/OrderSummary';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CheckoutPage = () => {
  // All hooks must be called at the top level, before any conditional logic
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotalAmount);
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isDarkMode = useSelector(selectIsDarkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNavigatingToSuccess = useRef(false);

  // State
  const [activeStep, setActiveStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(
    useSelector((state) => state.cart.shippingAddress) || {}
  );
  const [paymentMethod, setPaymentMethod] = useState(
    useSelector((state) => state.cart.paymentMethod) || 'Cash on Delivery'
  );
  
  // Order creation mutation
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  // Check if cart is empty or user is not authenticated
  useEffect(() => {
    // Skip all redirects if order has been successfully placed
    if (orderSuccess) {
      return;
    }
    
    // If we are in the process of navigating to success due to an order, don't interfere.
    if (isNavigatingToSuccess.current) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
      return; // Return after navigation
    }
    
    // Only redirect to cart if cart is empty AND an order hasn't just been placed successfully.
    if (cartItems.length === 0 && !orderPlaced) { 
      navigate('/cart');
    }
  }, [cartItems, isAuthenticated, navigate, orderPlaced, orderSuccess]);

  // Handle shipping form submission
  const handleShippingSubmit = (addressData) => {
    setShippingAddress(addressData);
    dispatch(saveShippingAddress(addressData));
    setActiveStep(2);
    window.scrollTo(0, 0);
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    // Check if method is an object (mobile banking) or string (standard payment)
    if (typeof method === 'object' && method.method) {
      // For mobile banking methods with transaction ID
      const paymentData = {
        method: method.method,
        transactionId: method.transactionId,
        accountNumber: method.accountNumber
      };
      setPaymentMethod(paymentData);
      dispatch(savePaymentMethod(paymentData));
    } else {
      // For standard payment methods like Cash on Delivery
      setPaymentMethod(method);
      dispatch(savePaymentMethod(method));
    }
    setActiveStep(3);
    window.scrollTo(0, 0);
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    try {
      // Set local loading state
      setOrderPlaced(true);
      
      // Calculate prices
      const itemsPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      
      const shippingPrice = itemsPrice > 1000 ? 0 : 60;
      const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
      
      // Keep totalPrice as a number here
      const totalPrice = itemsPrice + shippingPrice + taxPrice;

      const orderDataPayload = {
        orderItems: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          image: item.image || '/images/placeholder.jpg', // Add fallback image path
          price: item.price,
          variant: item.variant ? item.variant._id : undefined,
        })),
        shippingAddress,
        paymentMethod: typeof paymentMethod === 'object' && paymentMethod.method ? paymentMethod.method : paymentMethod,
        paymentDetails: typeof paymentMethod === 'object' ? { 
          transactionId: paymentMethod.transactionId, 
          accountNumber: paymentMethod.accountNumber 
        } : undefined,
        itemsPrice: parseFloat(itemsPrice.toFixed(2)),
        shippingPrice: parseFloat(shippingPrice.toFixed(2)),
        taxPrice: parseFloat(taxPrice.toFixed(2)),
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        user: user?._id, 
      };

      const { data: orderResponseData } = await createOrder(orderDataPayload).unwrap();
      const orderId = orderResponseData?._id;

      isNavigatingToSuccess.current = true; 
      
      dispatch(clearCart());
      dispatch(setNotification({
        type: 'success',
        message: 'Order placed successfully!',
        duration: 5000
      }));
      
      localStorage.setItem('lastOrderId', orderId || 'latest');
      if (orderId) {
        localStorage.setItem('lastOrderTimestamp', new Date().toISOString());
      }
      
      // Instead of navigating away, show success view in this component
      setCompletedOrder({
        id: orderId,
        date: new Date().toISOString(),
        items: cartItems,
        total: totalPrice,
        shippingAddress,
        paymentMethod
      });
      setOrderSuccess(true);
      window.scrollTo(0, 0);

    } catch (error) {
      isNavigatingToSuccess.current = false;
      setOrderPlaced(false); // Reset order placed state on error
      dispatch(setNotification({
        type: 'error',
        message: error.data?.message || 'Failed to place order. Please try again.',
        duration: 5000
      }));
    }
  };

  // Handle step navigation
  const goToStep = (step) => {
    if (step <= activeStep) {
      setActiveStep(step);
      window.scrollTo(0, 0);
    }
  };

  // Render loading UI
  const renderLoadingUI = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`max-w-md w-full mx-auto p-8 rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="w-full h-full border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Processing Your Order</h2>
          <p className="text-sm mb-6">Please wait while we finalize your purchase</p>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">Validating cart items</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center mr-3 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-sm">Processing payment</span>
            </div>
            <div className="flex items-center opacity-60">
              <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center mr-3">
              </div>
              <span className="text-sm">Creating order</span>
            </div>
            <div className="flex items-center opacity-60">
              <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center mr-3">
              </div>
              <span className="text-sm">Finalizing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render success view
  const renderSuccessView = () => (
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
            {completedOrder && completedOrder.id && <p className="text-md mt-2">Order ID: {completedOrder.id}</p>}
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

  // Render checkout form
  const renderCheckoutForm = () => (
    <div className={isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        
        <CheckoutSteps 
          activeStep={activeStep} 
          onStepClick={goToStep}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {activeStep === 1 && (
                <AddressForm 
                  initialValues={shippingAddress}
                  onSubmit={handleShippingSubmit}
                />
              )}
              
              {activeStep === 2 && (
                <PaymentMethodSelector 
                  selectedMethod={paymentMethod}
                  onSelect={handlePaymentMethodSelect}
                />
              )}
              
              {activeStep === 3 && (
                <>
                  <h2 className="text-xl font-semibold mb-6">Order Review</h2>
                  
                  {/* Shipping address summary */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">Shipping Address</h3>
                      <button 
                        onClick={() => goToStep(1)}
                        className="text-primary-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                    </div>
                    <div className={`p-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p>{shippingAddress.fullName}</p>
                      <p>{shippingAddress.address}</p>
                      <p>
                        {shippingAddress.city}, {shippingAddress.postalCode}
                      </p>
                      <p>{shippingAddress.phone}</p>
                    </div>
                  </div>
                  
                  {/* Payment method summary */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">Payment Method</h3>
                      <button 
                        onClick={() => goToStep(2)}
                        className="text-primary-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                    </div>
                    <div className={`p-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      {typeof paymentMethod === 'object' && paymentMethod.method ? (
                        <div>
                          <p><strong>{paymentMethod.method}</strong></p>
                          <p className="text-sm mt-1">Transaction ID: {paymentMethod.transactionId}</p>
                          <p className="text-sm">Account: {paymentMethod.accountNumber}</p>
                        </div>
                      ) : (
                        <p>{paymentMethod}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Order items */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Order Items</h3>
                    <div className={`rounded divide-y ${isDarkMode ? 'bg-gray-700 divide-gray-600' : 'bg-gray-50 divide-gray-200'}`}>
                      {cartItems.map((item) => (
                        <div key={`${item.product}${item.variant?._id || ''}`} className="flex py-4 px-4">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="ml-4 flex flex-1 flex-col">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between mt-1 text-sm text-gray-500 dark:text-gray-400">
                              <p>
                                {item.variant && `${item.variant.name} • `}
                                Qty: {item.quantity}
                              </p>
                              <p>৳{item.price} each</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Place order button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading || orderPlaced}
                    className={`w-full py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium ${
                      (isLoading || orderPlaced) ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading || orderPlaced ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                        Processing Order...
                      </div>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              totalAmount={totalAmount}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Main render logic - after all hooks have been called
  if (orderPlaced && !orderSuccess) {
    return renderLoadingUI();
  }

  if (orderSuccess && completedOrder) {
    return renderSuccessView();
  }

  return renderCheckoutForm();
};

export default CheckoutPage;

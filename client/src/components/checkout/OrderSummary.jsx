import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectIsDarkMode } from '../../features/ui/uiSlice';

const OrderSummary = ({ cartItems, totalAmount, paymentMethod }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  
  // Calculate prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  // Free shipping for orders over 1000 BDT
  const shippingPrice = itemsPrice > 1000 ? 0 : 60;
  
  // 15% VAT
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  
  // Total price
  const total = (
    itemsPrice +
    shippingPrice +
    taxPrice
  ).toFixed(2);

  return (
    <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto`}>
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      
      {/* Order items summary */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span>Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
          <span>৳{itemsPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Shipping</span>
          {shippingPrice === 0 ? (
            <span className="text-green-500">Free</span>
          ) : (
            <span>৳{shippingPrice.toFixed(2)}</span>
          )}
        </div>
        <div className="flex justify-between mb-1">
          <span>VAT (15%)</span>
          <span>৳{taxPrice.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Payment Method */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Payment Method</h3>
        {typeof paymentMethod === 'object' && paymentMethod.method ? (
          <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <p><strong>{paymentMethod.method}</strong></p>
            <p className="text-sm mt-1">Transaction ID: {paymentMethod.transactionId}</p>
            <p className="text-sm">Account: {paymentMethod.accountNumber}</p>
          </div>
        ) : (
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {paymentMethod}
          </p>
        )}
      </div>
      
      {/* Order total */}
      <div className={`flex justify-between font-bold text-lg pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <span>Total</span>
        <span>৳{total}</span>
      </div>
      
      {/* Free shipping threshold notice */}
      {itemsPrice < 1000 && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm rounded-md">
          Add <span className="font-medium">৳{(1000 - itemsPrice).toFixed(2)}</span> more to qualify for free shipping!
        </div>
      )}
      
      {/* Return to cart link */}
      <div className="mt-6">
        <Link 
          to="/cart" 
          className="text-primary-600 hover:underline text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Return to cart
        </Link>
      </div>
      
      {/* Secure checkout notice */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-gray-500 dark:text-gray-400">Secure Checkout</span>
        </div>
        <div className="flex justify-center space-x-2">
          {/* Payment icons */}
          <span className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>bKash</span>
          <span className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>Nagad</span>
          <span className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>VISA</span>
          <span className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>MasterCard</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  removeFromCart, 
  updateCartQuantity, 
  selectCartItems, 
  selectCartTotalAmount 
} from '../features/cart/cartSlice';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { selectIsDarkMode } from '../features/ui/uiSlice';
import QuantitySelector from '../components/ui/QuantitySelector';

const CartPage = () => {
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotalAmount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isDarkMode = useSelector(selectIsDarkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle quantity change
  const handleQuantityChange = (productId, quantity) => {
    dispatch(updateCartQuantity({ product: productId, quantity }));
  };

  // Handle remove item
  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  // Handle proceed to checkout
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className={`p-8 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md text-center`}>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className={`rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <table className="w-full">
                  <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Quantity</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cartItems.map((item) => (
                      <tr key={`${item.product}${item.variant?._id || ''}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-4">
                              <Link
                                to={`/products/${item.slug || item.product}`}
                                className="font-medium hover:text-primary-600"
                              >
                                {item.name}
                              </Link>
                              {item.variant && (
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  {item.variant.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium">৳{item.price}</span>
                        </td>
                        <td className="px-6 py-4">
                          <QuantitySelector
                            value={item.quantity}
                            onChange={(quantity) => handleQuantityChange(item.product, quantity)}
                            max={item.countInStock}
                            min={1}
                            small
                          />
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleRemoveItem(item.product)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Continue shopping button */}
              <div className="mt-6">
                <Link
                  to="/products"
                  className={`inline-flex items-center px-4 py-2 rounded-md ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  } transition-colors`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                    <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                    <span className="font-semibold">৳{parseFloat(totalAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                    <span>VAT (15%)</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Estimated Total</span>
                    <span>৳{parseFloat(totalAmount).toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                </button>
                
                {/* Payment methods */}
                <div className="mt-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">We accept:</p>
                  <div className="flex space-x-2">
                    {/* Replace these with actual payment icons */}
                    <span className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>bKash</span>
                    <span className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>Nagad</span>
                    <span className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>VISA</span>
                    <span className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>Mastercard</span>
                    <span className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>COD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

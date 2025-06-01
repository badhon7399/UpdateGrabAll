import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About GrabAll</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              GrabAll is a leading e-commerce platform in Bangladesh, offering a wide range of products with fast delivery and excellent customer service.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500" aria-label="Facebook">
                <FiFacebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500" aria-label="Instagram">
                <FiInstagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500" aria-label="Twitter">
                <FiTwitter size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500" aria-label="YouTube">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/user/orders" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/user/wishlist" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiMapPin className="text-primary-600 dark:text-primary-500 mt-1" size={18} />
                <span className="text-gray-600 dark:text-gray-300">
                  123 Commerce Street, Dhaka 1000, Bangladesh
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="text-primary-600 dark:text-primary-500" size={18} />
                <span className="text-gray-600 dark:text-gray-300">
                  +880 1234-567890
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="text-primary-600 dark:text-primary-500" size={18} />
                <span className="text-gray-600 dark:text-gray-300">
                  support@graball.com
                </span>
              </li>
            </ul>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Subscribe to our newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 py-2 px-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-r-md transition duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom footer */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 md:mb-0">
              &copy; {currentYear} GrabAll. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-4">
              <img src="https://picsum.photos/seed/visa-1/40/25" alt="Visa" className="h-6" />
              <img src="https://picsum.photos/seed/mastercard-1/40/25" alt="Mastercard" className="h-6" />
              <img src="https://picsum.photos/seed/bkash-1/40/25" alt="bKash" className="h-6" />
              <img src="https://picsum.photos/seed/nagad-1/40/25" alt="Nagad" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import ProductCard from './ProductCard';

// Demo products based on the provided images
const demoProducts = [
  {
    _id: 'demo-product-1',
    name: 'Portable Laptop Desk',
    slug: 'portable-laptop-desk',
    description: 'Elegant portable laptop desk with foldable legs, perfect for working from bed, couch, or any comfortable spot.',
    price: 2499,
    compareAtPrice: 2999,
    brand: 'ComfortDesk',
    countInStock: 25,
    category: { name: 'Furniture' },
    images: [{ url: 'https://i.imgur.com/RcKQbmE.jpg' }],
    rating: 4.5,
    numReviews: 12,
    discount: 17,
    isFeatured: true,
    isActive: true
  },
  {
    _id: 'demo-product-2',
    name: 'SKE Mini DC UPS',
    slug: 'ske-mini-dc-ups',
    description: 'Reliable mini DC UPS for small electronics and network devices. Provides backup power during outages.',
    price: 3500,
    compareAtPrice: 3999,
    brand: 'SKE',
    countInStock: 15,
    category: { name: 'Electronics' },
    images: [{ url: 'https://i.imgur.com/NPpjchn.jpg' }],
    rating: 4.2,
    numReviews: 8,
    discount: 12,
    isFeatured: true,
    isActive: true
  },
  {
    _id: 'demo-product-3',
    name: 'Casio fx-991CW Scientific Calculator',
    slug: 'casio-calculator',
    description: 'Advanced scientific calculator with natural textbook display and 552 functions.',
    price: 1799,
    compareAtPrice: 1999,
    brand: 'Casio',
    countInStock: 30,
    category: { name: 'Office Supplies' },
    images: [{ url: 'https://i.imgur.com/7xHsKkJ.jpg' }],
    rating: 4.8,
    numReviews: 25,
    discount: 10,
    isFeatured: true,
    isActive: true
  },
  {
    _id: 'demo-product-4',
    name: 'Personalized LED Night Light',
    slug: 'personalized-led-night-light',
    description: 'Custom LED night light with personalized names and a heart symbol. Perfect romantic gift.',
    price: 1299,
    compareAtPrice: 1599,
    brand: 'LoveLight',
    countInStock: 20,
    category: { name: 'Gifts' },
    images: [{ url: 'https://i.imgur.com/I8b5tjE.jpg' }],
    rating: 4.7,
    numReviews: 15,
    discount: 19,
    isFeatured: true,
    isActive: true
  },
  {
    _id: 'demo-product-5',
    name: 'Love Pearl Gift Set',
    slug: 'love-pearl-gift-set',
    description: 'Unique gift featuring a real cultured pearl inside an oyster, with an elegant pendant necklace.',
    price: 1999,
    compareAtPrice: 2499,
    brand: 'Pearl Treasures',
    countInStock: 10,
    category: { name: 'Gifts' },
    images: [{ url: 'https://i.imgur.com/a9F4CaH.jpg' }],
    rating: 4.6,
    numReviews: 18,
    discount: 20,
    isFeatured: true,
    isActive: true
  }
];

const DemoProducts = ({ 
  title = "Featured Products", 
  count = 5, 
  showViewAll = true, 
  variant = 'default' 
}) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const products = demoProducts.slice(0, count);

  return (
    <div className={`py-10 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        {/* Section Header with Enhanced Styling */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h2>
            <div className="w-20 h-1 bg-primary-600 mt-2 rounded-full"></div>
          </div>
          {showViewAll && (
            <Link 
              to="/products" 
              className={`inline-flex items-center text-sm font-medium transition-colors ${isDarkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'}`}
            >
              View All Products
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
        
        {/* Product Grid with Improved Spacing and Responsiveness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
          {products.map(product => (
            <ProductCard key={product._id} product={product} variant={variant} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoProducts;

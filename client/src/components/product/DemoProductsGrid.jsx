import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import ProductCard from './ProductCard';

// Demo products based on the provided images - shared with DemoProducts component
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

// Additional demo products for the products page
const additionalDemoProducts = [
  {
    _id: 'demo-product-6',
    name: 'Wireless Earbuds Pro',
    slug: 'wireless-earbuds-pro',
    description: 'Premium wireless earbuds with noise cancellation and crystal clear sound quality.',
    price: 4999,
    compareAtPrice: 5999,
    brand: 'SoundMaster',
    countInStock: 18,
    category: { name: 'Electronics' },
    images: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&q=80' }],
    rating: 4.7,
    numReviews: 32,
    discount: 17,
    isFeatured: false,
    isActive: true
  },
  {
    _id: 'demo-product-7',
    name: 'Smart Watch Series 5',
    slug: 'smart-watch-series-5',
    description: 'Advanced smartwatch with health monitoring and fitness tracking features.',
    price: 8999,
    compareAtPrice: 9999,
    brand: 'TechWear',
    countInStock: 12,
    category: { name: 'Electronics' },
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&q=80' }],
    rating: 4.8,
    numReviews: 45,
    discount: 10,
    isFeatured: false,
    isActive: true
  },
  {
    _id: 'demo-product-8',
    name: 'Ergonomic Office Chair',
    slug: 'ergonomic-office-chair',
    description: 'Comfortable ergonomic chair with lumbar support for long working hours.',
    price: 12999,
    compareAtPrice: 14999,
    brand: 'ComfortPlus',
    countInStock: 8,
    category: { name: 'Furniture' },
    images: [{ url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=300&h=300&q=80' }],
    rating: 4.6,
    numReviews: 28,
    discount: 13,
    isFeatured: false,
    isActive: true
  },
  {
    _id: 'demo-product-9',
    name: 'Portable Bluetooth Speaker',
    slug: 'portable-bluetooth-speaker',
    description: 'Waterproof portable speaker with 20-hour battery life and deep bass.',
    price: 3499,
    compareAtPrice: 3999,
    brand: 'SoundWave',
    countInStock: 22,
    category: { name: 'Electronics' },
    images: [{ url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&q=80' }],
    rating: 4.5,
    numReviews: 36,
    discount: 12,
    isFeatured: false,
    isActive: true
  }
];

// Combine all demo products
const allDemoProducts = [...demoProducts, ...additionalDemoProducts];

const DemoProductsGrid = ({ count = 5, variant = 'default' }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const products = count === 'all' ? allDemoProducts : allDemoProducts.slice(0, count);

  return (
    <>
      {products.map(product => (
        <ProductCard key={product._id} product={product} variant={variant} />
      ))}
    </>
  );
};

export default DemoProductsGrid;

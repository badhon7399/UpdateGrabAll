import React from 'react';
import ProductListingPage from './ProductListingPage';

// This file exists to maintain backward compatibility with the imports in App.jsx
// It simply re-exports the ProductListingPage component

const ProductsPage = () => {
  return <ProductListingPage />;
};

export default ProductsPage;

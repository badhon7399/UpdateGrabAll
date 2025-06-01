import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery, useGetCategoriesQuery } from '../features/api/apiSlice';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductCard from '../components/product/ProductCard';
import PriceRangeFilter from '../components/filters/PriceRangeFilter';
import CategoryFilter from '../components/filters/CategoryFilter';
import BrandFilter from '../components/filters/BrandFilter';
import RatingFilter from '../components/filters/RatingFilter';
import AvailabilityFilter from '../components/filters/AvailabilityFilter';
import DiscountFilter from '../components/filters/DiscountFilter';
import SortOptions from '../components/filters/SortOptions';
import Pagination from '../components/ui/Pagination';
import { selectIsDarkMode } from '../features/ui/uiSlice';
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isDarkMode = useSelector(selectIsDarkMode);
  
  // Get filter params from URL
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 12;
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 100000;
  const rating = Number(searchParams.get('rating')) || 0;
  const minDiscount = Number(searchParams.get('minDiscount')) || 0;
  const inStock = searchParams.get('inStock') ? searchParams.get('inStock') === 'true' : null;
  
  // Mobile filter visibility
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter section collapse state
  const [collapsedSections, setCollapsedSections] = useState({
    category: false,
    price: false,
    rating: false,
    availability: false,
    discount: false
  });
  
  // Toggle section collapse
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // State for filter options
  const [filters, setFilters] = useState({
    page,
    limit,
    category,
    search,
    sort,
    minPrice,
    maxPrice,
    rating,
    minDiscount,
    inStock,
  });
  
  // Build query parameters for API
  const queryParams = {
    page: filters.page,
    limit: filters.limit,
    ...(filters.category && { category: filters.category }),
    ...(filters.search && { search: filters.search }),
    ...(filters.sort && { sort: filters.sort }),
    ...(filters.minPrice > 0 && { minPrice: filters.minPrice }),
    ...(filters.maxPrice < 100000 && { maxPrice: filters.maxPrice }),
    ...(filters.rating > 0 && { rating: filters.rating }),
    ...(filters.minDiscount > 0 && { minDiscount: filters.minDiscount }),
    ...(filters.inStock !== null && { inStock: filters.inStock }),
  };
  
  // Fetch products with filter params
  const { 
    data: productsData, 
    isLoading: isLoadingProducts, 
    isFetching: isFetchingProducts,
    error: productsError 
  } = useGetProductsQuery(queryParams);
  
  // Fetch categories for filter sidebar
  const { 
    data: categoriesData, 
    isLoading: isLoadingCategories 
  } = useGetCategoriesQuery();
  
  // Synchronize URL search params to filters state, but only when URL params change
  useEffect(() => {
    // Only update filters if the URL params are different from current filters
    // This prevents the infinite loop
    const urlPage = Number(searchParams.get('page')) || 1;
    const urlLimit = Number(searchParams.get('limit')) || 12;
    const urlCategory = searchParams.get('category') || '';
    const urlSearch = searchParams.get('search') || '';
    const urlSort = searchParams.get('sort') || 'newest';
    const urlMinPrice = Number(searchParams.get('minPrice')) || 0;
    const urlMaxPrice = Number(searchParams.get('maxPrice')) || 100000;
    const urlRating = Number(searchParams.get('rating')) || 0;
    const urlMinDiscount = Number(searchParams.get('minDiscount')) || 0;
    const urlInStock = searchParams.get('inStock') ? searchParams.get('inStock') === 'true' : null;
    
    // Only update if any param has changed
    if (
      urlPage !== filters.page ||
      urlLimit !== filters.limit ||
      urlCategory !== filters.category ||
      urlSearch !== filters.search ||
      urlSort !== filters.sort ||
      urlMinPrice !== filters.minPrice ||
      urlMaxPrice !== filters.maxPrice ||
      urlRating !== filters.rating ||
      urlMinDiscount !== filters.minDiscount ||
      urlInStock !== filters.inStock
    ) {
      setFilters({
        page: urlPage,
        limit: urlLimit,
        category: urlCategory,
        search: urlSearch,
        sort: urlSort,
        minPrice: urlMinPrice,
        maxPrice: urlMaxPrice,
        rating: urlRating,
        minDiscount: urlMinDiscount,
        inStock: urlInStock,
      });
    }
  }, [searchParams]);
  
  // Update URL when filters change, with a ref to track first render
  const isFirstRender = React.useRef(true);
  useEffect(() => {
    // Skip the first render to prevent double API calls on page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    const newSearchParams = new URLSearchParams();
    
    if (filters.page !== 1) newSearchParams.set('page', filters.page);
    if (filters.limit !== 12) newSearchParams.set('limit', filters.limit);
    if (filters.category) newSearchParams.set('category', filters.category);
    if (filters.search) newSearchParams.set('search', filters.search);
    if (filters.sort !== 'newest') newSearchParams.set('sort', filters.sort);
    if (filters.minPrice > 0) newSearchParams.set('minPrice', filters.minPrice);
    if (filters.maxPrice < 100000) newSearchParams.set('maxPrice', filters.maxPrice);
    if (filters.rating > 0) newSearchParams.set('rating', filters.rating);
    if (filters.minDiscount > 0) newSearchParams.set('minDiscount', filters.minDiscount);
    if (filters.inStock !== null) newSearchParams.set('inStock', filters.inStock);
    
    setSearchParams(newSearchParams);
  }, [filters, setSearchParams]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 }); // Reset to page 1 on filter change
  };
  
  // Handle pagination change
  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Reset all filters
  const handleResetAllFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      category: '',
      search: filters.search, // Keep the search term
      sort: 'newest',
      minPrice: 0,
      maxPrice: 100000,
      rating: 0,
      minDiscount: 0,
      inStock: null,
    });
  };
  
  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };
  
  const isLoading = isLoadingProducts || isLoadingCategories || isFetchingProducts;
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Products</h1>
          
          {/* Mobile filter toggle button */}
          <button
            onClick={toggleMobileFilters}
            className="md:hidden flex items-center mt-4 md:mt-0 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <FiFilter className="mr-2" />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {/* Search results info */}
        {search && (
          <div className="mb-6">
            <p className="text-lg">
              Search results for: <span className="font-semibold">{search}</span>
            </p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile filters overlay */}
          <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden ${showMobileFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleMobileFilters}></div>
          
          {/* Filters sidebar */}
          <div className={`${showMobileFilters ? 'fixed left-0 top-0 h-full overflow-y-auto z-50 w-3/4 shadow-xl' : 'hidden'} md:sticky md:top-4 md:block md:w-1/4 md:max-h-[calc(100vh-2rem)] md:overflow-y-auto md:self-start ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md transition-all duration-300`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button onClick={toggleMobileFilters} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <FiX size={24} />
              </button>
            </div>
            
            {/* Filter sections */}
            <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
              {/* Category filter */}
              <div className="pt-4 first:pt-0">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('category')}>
                  <h3 className="font-semibold">Categories</h3>
                  {collapsedSections.category ? <FiChevronDown /> : <FiChevronUp />}
                </div>
                {!collapsedSections.category && !isLoadingCategories && categoriesData && (
                  <div className="mt-2">
                    <CategoryFilter 
                      categories={categoriesData?.data || []} 
                      selectedCategory={filters.category}
                      onChange={(category) => handleFilterChange({ category })}
                    />
                  </div>
                )}
              </div>
              
              {/* Price range filter */}
              <div className="pt-4">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('price')}>
                  <h3 className="font-semibold">Price Range</h3>
                  {collapsedSections.price ? <FiChevronDown /> : <FiChevronUp />}
                </div>
                {!collapsedSections.price && (
                  <div className="mt-2">
                    <PriceRangeFilter
                      minPrice={filters.minPrice}
                      maxPrice={filters.maxPrice}
                      onChange={({ minPrice, maxPrice }) => 
                        handleFilterChange({ minPrice, maxPrice })
                      }
                    />
                  </div>
                )}
              </div>
              
              {/* Brand filter placeholder - to be implemented when API is ready */}
              
              {/* Rating filter */}
              <div className="pt-4">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('rating')}>
                  <h3 className="font-semibold">Rating</h3>
                  {collapsedSections.rating ? <FiChevronDown /> : <FiChevronUp />}
                </div>
                {!collapsedSections.rating && (
                  <div className="mt-2">
                    <RatingFilter 
                      selectedRating={filters.rating}
                      onChange={(rating) => handleFilterChange({ rating })}
                    />
                  </div>
                )}
              </div>
              
              {/* Availability filter */}
              <div className="pt-4">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('availability')}>
                  <h3 className="font-semibold">Availability</h3>
                  {collapsedSections.availability ? <FiChevronDown /> : <FiChevronUp />}
                </div>
                {!collapsedSections.availability && (
                  <div className="mt-2">
                    <AvailabilityFilter 
                      inStock={filters.inStock}
                      onChange={(inStock) => handleFilterChange({ inStock })}
                    />
                  </div>
                )}
              </div>
              
              {/* Discount filter */}
              <div className="pt-4">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('discount')}>
                  <h3 className="font-semibold">Discount</h3>
                  {collapsedSections.discount ? <FiChevronDown /> : <FiChevronUp />}
                </div>
                {!collapsedSections.discount && (
                  <div className="mt-2">
                    <DiscountFilter 
                      minDiscount={filters.minDiscount}
                      onChange={(minDiscount) => handleFilterChange({ minDiscount })}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Reset all filters button */}
            <button
              onClick={handleResetAllFilters}
              className={`w-full py-3 mt-6 rounded-md flex items-center justify-center ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} transition duration-200`}
            >
              <FiX className="mr-2" /> Reset All Filters
            </button>
          </div>
          
          {/* Product grid */}
          <div className="w-full md:w-3/4">
            {/* Sort and filter bar */}
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md sticky top-0 z-10`}>
              <div className="flex items-center mb-3 sm:mb-0">
                <p className="text-sm font-medium">
                  {productsData?.totalProducts || 0} products found
                </p>
                {/* Active filters display */}
                <div className="flex flex-wrap ml-4 gap-2">
                  {filters.category && (
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      Category: {filters.category}
                      <button onClick={() => handleFilterChange({ category: '' })} className="ml-1 hover:text-red-500">
                        <FiX size={14} />
                      </button>
                    </span>
                  )}
                  {filters.minPrice > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      Min: ${filters.minPrice}
                      <button onClick={() => handleFilterChange({ minPrice: 0 })} className="ml-1 hover:text-red-500">
                        <FiX size={14} />
                      </button>
                    </span>
                  )}
                  {filters.maxPrice < 100000 && (
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      Max: ${filters.maxPrice}
                      <button onClick={() => handleFilterChange({ maxPrice: 100000 })} className="ml-1 hover:text-red-500">
                        <FiX size={14} />
                      </button>
                    </span>
                  )}
                  {filters.rating > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      {filters.rating}★ & Up
                      <button onClick={() => handleFilterChange({ rating: 0 })} className="ml-1 hover:text-red-500">
                        <FiX size={14} />
                      </button>
                    </span>
                  )}
                  {filters.minDiscount > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      {filters.minDiscount}% Off & More
                      <button onClick={() => handleFilterChange({ minDiscount: 0 })} className="ml-1 hover:text-red-500">
                        <FiX size={14} />
                      </button>
                    </span>
                  )}
                  {filters.inStock !== null && (
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      {filters.inStock ? 'In Stock' : 'Out of Stock'}
                      <button onClick={() => handleFilterChange({ inStock: null })} className="ml-1 hover:text-red-500">
                        <FiX size={14} />
                      </button>
                    </span>
                  )}
                  {/* Brand filter tags will be added when API is ready */}
                </div>
              </div>
              <SortOptions
                selectedSort={filters.sort}
                onChange={(sort) => handleFilterChange({ sort })}
              />
            </div>
            
            {/* Loading state */}
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            )}
            
            {/* Error state */}
            {!isLoading && productsError && (
              <div className={`text-center py-10 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <p className="text-red-500 mb-4">Error loading products. Please try again later.</p>
                <button
                  onClick={handleResetAllFilters}
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition duration-200"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {/* Empty state */}
            {!isLoading && !productsError && (!productsData?.products || productsData?.products.length === 0) && (
              <div className={`text-center py-10 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <p className="mb-4">No products found matching your criteria.</p>
                <button
                  onClick={handleResetAllFilters}
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition duration-200"
                >
                  Reset All Filters
                </button>
              </div>
            )}
            
            {/* Product grid */}
            {!isLoading && !productsError && productsData?.products && productsData.products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsData.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!isLoading && !productsError && productsData?.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={filters.page}
                  totalPages={productsData.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;

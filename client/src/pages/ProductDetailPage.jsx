import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  useGetProductQuery, 
  useCreateReviewMutation,
  useGetProductsQuery 
} from '../features/api/apiSlice';
import { addToCart } from '../features/cart/cartSlice';
import { selectIsAuthenticated, selectCurrentUser } from '../features/auth/authSlice';
import { selectIsDarkMode, setNotification } from '../features/ui/uiSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductImageGallery from '../components/product/ProductImageGallery';
import StarRating from '../components/ui/StarRating';
import ReviewForm from '../components/product/ReviewForm';
import ProductReviews from '../components/product/ProductReviews';
import QuantitySelector from '../components/ui/QuantitySelector';
import ProductCard from '../components/product/ProductCard';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const isDarkMode = useSelector(selectIsDarkMode);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Fetch product details
  const {
    data: product,
    isLoading,
    error,
    refetch
  } = useGetProductQuery(slug);
  
  // Fetch related products
  const { data: relatedProductsData } = useGetProductsQuery(
    { category: product?.category?._id, limit: 4 },
    { skip: !product?.category?._id }
  );
  
  // Review mutation
  const [createReview, { isLoading: isSubmittingReview }] = useCreateReviewMutation();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`container mx-auto px-4 py-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <h2 className="text-2xl font-bold mb-4">Error Loading Product</h2>
        <p className="mb-8">
          We couldn't load the product details. Please try again later.
        </p>
        <button
          onClick={() => navigate(-1)}
          className={`px-6 py-2 rounded-md ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Go Back
        </button>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className={`container mx-auto px-4 py-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/products"
          className={`px-6 py-2 rounded-md ${
            isDarkMode ? 'bg-primary-600 hover:bg-primary-700' : 'bg-primary-500 hover:bg-primary-600'
          } text-white`}
        >
          Browse Products
        </Link>
      </div>
    );
  }
  
  // Handle adding product to cart
  const handleAddToCart = () => {
    const variantToAdd = selectedVariant || (product.variants && product.variants.length > 0 
      ? product.variants[0] 
      : null);
    
    const cartItem = {
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: variantToAdd ? variantToAdd.price : product.price,
      countInStock: variantToAdd ? variantToAdd.countInStock : product.countInStock,
      quantity,
      ...(variantToAdd && { 
        variant: {
          _id: variantToAdd._id,
          name: variantToAdd.name,
          attributes: variantToAdd.attributes
        } 
      })
    };
    
    dispatch(addToCart(cartItem));
    dispatch(setNotification({
      type: 'success',
      message: `${product.name} added to cart`,
      duration: 3000
    }));
  };
  
  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };
  
  // Handle submitting a review
  const handleSubmitReview = async (reviewData) => {
    try {
      await createReview({ 
        productId: product._id, 
        rating: reviewData.rating,
        comment: reviewData.comment
      }).unwrap();
      
      dispatch(setNotification({
        type: 'success',
        message: 'Review submitted successfully',
        duration: 3000
      }));
      
      setShowReviewForm(false);
      refetch(); // Refresh product data to show new review
    } catch (err) {
      dispatch(setNotification({
        type: 'error',
        message: err.data?.message || 'Failed to submit review',
        duration: 5000
      }));
    }
  };
  
  // Check if user has already reviewed
  const hasUserReviewed = product.reviews?.some(
    (review) => review.user._id === user?._id
  );
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="hover:text-primary-600 transition-colors">
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link to="/products" className="ml-1 hover:text-primary-600 transition-colors">
                  Products
                </Link>
              </li>
              <li aria-current="page" className="flex items-center">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-gray-500 truncate max-w-xs">
                  {product.name}
                </span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Product details */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product images */}
            <div>
              <ProductImageGallery images={product.images} />
            </div>
            
            {/* Product info */}
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <StarRating value={product.rating} readOnly />
                <span className="ml-2">
                  ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                {product.discount > 0 ? (
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-primary-600">
                      ৳{product.price - (product.price * product.discount / 100)}
                    </span>
                    <span className="ml-2 line-through text-gray-500">
                      ৳{product.price}
                    </span>
                    <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded">
                      {product.discount}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-primary-600">
                    ৳{product.price}
                  </span>
                )}
              </div>
              
              {/* Availability */}
              <div className="mb-6">
                <p className="flex items-center">
                  <span className="mr-2">Availability:</span>
                  {product.countInStock > 0 ? (
                    <span className="text-green-500 font-semibold">In Stock</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Out of Stock</span>
                  )}
                </p>
              </div>
              
              {/* Product variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Variants</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant._id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3 py-1 border rounded-md ${
                          selectedVariant?._id === variant._id
                            ? 'border-primary-600 bg-primary-50 text-primary-600'
                            : `${isDarkMode ? 'border-gray-600 hover:border-gray-400' : 'border-gray-300 hover:border-gray-400'}`
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity selector */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Quantity</h3>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  max={product.countInStock}
                  min={1}
                />
              </div>
              
              {/* Add to cart and buy now buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className={`px-6 py-3 rounded-md flex-1 ${
                    product.countInStock === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.countInStock === 0}
                  className={`px-6 py-3 rounded-md flex-1 ${
                    product.countInStock === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-secondary-600 hover:bg-secondary-700 text-white'
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
          
          {/* Description and details */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <div 
              className="prose max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
          
          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4">Specifications</h2>
              <table className={`w-full ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr key={index} className={index % 2 === 0 ? 
                      (isDarkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}>
                      <td className="py-2 px-4 font-medium">{spec.name}</td>
                      <td className="py-2 px-4">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Reviews */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Reviews</h2>
              {isAuthenticated && !hasUserReviewed && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Write a Review
                </button>
              )}
            </div>
            
            {/* Review form */}
            {showReviewForm && (
              <div className="mb-8">
                <ReviewForm 
                  onSubmit={handleSubmitReview} 
                  isLoading={isSubmittingReview}
                  onCancel={() => setShowReviewForm(false)} 
                />
              </div>
            )}
            
            {/* Reviews list */}
            <ProductReviews reviews={product.reviews || []} />
            
            {/* No reviews message */}
            {(!product.reviews || product.reviews.length === 0) && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">This product has no reviews yet.</p>
                {isAuthenticated ? (
                  !hasUserReviewed && !showReviewForm && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Be the first to review
                    </button>
                  )
                ) : (
                  <Link
                    to="/login"
                    className="text-primary-600 hover:underline"
                  >
                    Log in to write a review
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Related products */}
        {relatedProductsData?.products && relatedProductsData.products.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProductsData.products
                .filter(p => p._id !== product._id) // Filter out current product
                .slice(0, 4)
                .map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;

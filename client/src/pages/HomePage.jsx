import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiShoppingBag,
  FiTruck,
  FiCreditCard,
  FiHeadphones,
} from "react-icons/fi";
import {
  useGetActiveBannersQuery,
  useGetFeaturedProductsQuery,
  useGetFeaturedCategoriesQuery,
} from "../features/api/apiSlice";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import BannerSlider from "../components/ui/BannerSlider";
import ModernCategoryGrid from "./NEWCATA";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HomePage = () => {
  const { data: banners, isLoading: bannersLoading } =
    useGetActiveBannersQuery();
  const { data: featuredProducts, isLoading: productsLoading } =
    useGetFeaturedProductsQuery();
  const { data: featuredCategories, isLoading: categoriesLoading } =
    useGetFeaturedCategoriesQuery();

  const navigate = useNavigate();
  const location = useLocation();

  // Check for redirect to order success from checkout page
  useEffect(() => {
    // Check if we should redirect to order success (from location state)
    if (location.state?.redirectToOrderSuccess) {
      const orderId = location.state.orderId;
      // Clear the state to prevent redirect loops
      window.history.replaceState({}, document.title);
      // Navigate to order success page
      navigate(`/order-success/${orderId}`);
      return;
    }
    
    // Alternative: Check localStorage for recent order placement
    const orderJustPlaced = localStorage.getItem('orderJustPlaced') === 'true';
    const lastOrderId = localStorage.getItem('lastOrderId');
    
    if (orderJustPlaced && lastOrderId) {
      // Clear the flag to prevent redirect loops
      localStorage.removeItem('orderJustPlaced');
      // Navigate to order success page
      navigate(`/order-success/${lastOrderId}`);
    }
  }, [navigate, location]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Process banners for the slider
  const processedBanners =
    banners?.data && Array.isArray(banners.data) && banners.data.length > 0
      ? banners.data.map((banner) => {
          console.log("Original banner data:", banner); // Debug log
          return {
            _id: banner._id,
            title: banner.title,
            subtitle: banner.subtitle,
            tag: banner.tag || (banner.title ? banner.title.split(' ')[0] : "FASHION DAY"),
            // Handle image structure correctly - it could be a string or an object with url
            image: typeof banner.image === 'string' ? banner.image : banner.image?.url,
            buttonText: banner.buttonText || "Shop Now",
            link: banner.link || "/products",
            backgroundColor: banner.backgroundColor || "#f0f9ff",
            textColor: banner.textColor || "#ffffff", // Default to white text for better contrast
            active: banner.active,
            showButton: banner.showButton !== false,
          };
        })
      : [];
  console.log("Processed banners:", processedBanners); // Debug log
  const displayProducts = featuredProducts?.data || [];
  const displayCategories = featuredCategories?.data || [];

  return (
    <div className="home-page">
      {/* Hero Banner Slider - Always at the top */}
      <section className="mb-8">
        <BannerSlider 
          banners={processedBanners} 
          isLoading={bannersLoading}
          height="h-96 md:h-[32rem]"
          autoplay={true}
          showPagination={true}
          showNavigation={true}
        />
      </section>
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4 text-3xl">
                <FiShoppingBag />
              </div>
              <h3 className="text-lg font-semibold mb-1 text-gray-600">Wide Selection</h3>
              <p className="text-gray-500">
                Thousands of products across multiple categories
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4 text-3xl">
                <FiTruck />
              </div>
              <h3 className="text-lg font-semibold mb-1 text-gray-600">Fast Delivery</h3>
              <p className="text-gray-500">Quick delivery across Bangladesh</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4 text-3xl">
                <FiCreditCard />
              </div>
              <h3 className="text-lg font-semibold mb-1 text-gray-600">Secure Payment</h3>
              <p className="text-gray-500">
                Multiple payment options including Cash on Delivery
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4 text-3xl">
                <FiHeadphones />
              </div>
              <h3 className="text-lg font-semibold mb-1 text-gray-600">24/7 Support</h3>
              <p className="text-gray-500">
                Customer service available all day, every day
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <ModernCategoryGrid />
      </section>
      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured <span className="text-blue-600">Products</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Discover our handpicked selection of premium products
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
          </motion.div>
          {productsLoading ? (
            <div className="flex justify-center items-center h-48">
              <LoadingSpinner />
            </div>
          ) : displayProducts && displayProducts.length > 0 ? (
            <>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12"
              >
                {displayProducts.slice(0, 5).map((product, index) => (
                  <motion.div
                    key={product._id}
                    variants={fadeInUp}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="group"
                  >
                    <Link to={`/products/${product.slug}`} className="block">
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-blue-200">
                        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-48">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiShoppingBag className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                          <div className="absolute top-3 left-3">
                            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                              Featured
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-blue-600">
                                ৳{product.price}
                              </span>
                              {product.originalPrice &&
                                product.originalPrice > product.price && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ৳{product.originalPrice}
                                  </span>
                                )}
                            </div>
                          </div>
                          {product.rating && (
                            <div className="flex items-center mt-2">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < Math.floor(product.rating)
                                        ? "fill-current"
                                        : "text-gray-300"
                                    }`}
                                    viewBox="0 0 20 20"
                                    fill={
                                      i < Math.floor(product.rating)
                                        ? "currentColor"
                                        : "none"
                                    }
                                    stroke="currentColor"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.719c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="ml-2 text-xs text-gray-500">
                                {product.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
              <div className="flex justify-center">
                <Link
                  to="/products"
                  className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition-all duration-300"
                >
                  View All Products
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              No featured products found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

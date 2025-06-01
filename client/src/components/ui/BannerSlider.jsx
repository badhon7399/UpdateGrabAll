import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import LoadingSpinner from './LoadingSpinner';

const BannerSlider = ({ 
  banners, 
  isLoading, 
  height = 'h-96 md:h-[32rem]', 
  autoplay = true,
  loop = true,
  showPagination = true,
  showNavigation = true
}) => {
  // Default slide duration - 5 seconds
  const autoplayConfig = autoplay ? {
    delay: 5000,
    disableOnInteraction: false,
  } : false;

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center bg-gray-100 dark:bg-gray-800 ${height}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  // Debug banner data
  console.log("Banner data in slider:", banners);

  return (
    <div className="relative banner-slider-container">
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={showPagination ? {
          clickable: true,
          dynamicBullets: true,
          el: '.custom-pagination',
        } : false}
        navigation={showNavigation ? {
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
          hideOnClick: false,
        } : false}
        loop={loop && banners.length > 1}
        autoplay={autoplayConfig}
        className="w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <div 
              className={`relative w-full ${height} bg-cover bg-center flex items-center overflow-hidden`}
              style={{ backgroundColor: banner.backgroundColor || '#f0f9ff' }}
            >
              {/* Fixed image URL access pattern to match the actual data structure */}
              <img
                src={banner.image?.url || banner.image || "/images/placeholder-banner.jpg"}
                alt={banner.title || "Promotional banner"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/placeholder-banner.jpg";
                }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Lighter content overlay - reduced opacity */}
              <div className="absolute inset-0 bg-black bg-opacity-5"></div>
              
              {/* Banner content - Text on right, button on bottom-left */}
              <div className="relative z-10 w-full h-full">
                {/* Text content - right side */}
                <div className="absolute inset-0 flex items-center justify-start px-8 md:px-15 lg:px-20">
                  <div className="max-w-xl w-full md:w-3/5 lg:w-1/2 pr-0 md:pr-8">
                    {/* Tag/Hashtag - Always visible */}
                    {banner.tag && (
                      <span 
                        className="inline-block text-lg md:text-xl font-medium mb-2 md:mb-4"
                        style={{ color: banner.textColor || '#ffffff' }}
                      >
                        #{banner.tag}
                      </span>
                    )}
                    
                    {/* Title (used for discount percentage) */}
                    {banner.title && (
                      <h2 
                        className="text-4xl md:text-6xl font-bold mb-2 md:mb-4"
                        style={{ color: banner.textColor || '#ffffff' }}
                      >
                        {banner.title}
                      </h2>
                    )}
                    
                    {/* Subtitle */}
                    {banner.subtitle && (
                      <p 
                        className="text-lg md:text-xl mb-6 md:mb-8"
                        style={{ color: banner.textColor || '#ffffff' }}
                      >
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Button - bottom left corner */}
                {banner.showButton !== false && (
                  <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                    <Link
                      to={banner.link || '/products'}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors duration-300"
                    >
                      {banner.buttonText || 'Shop Now'}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom navigation */}
      {showNavigation && banners.length > 1 && (
        <>
          <button className="custom-prev absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 dark:bg-gray-800 dark:bg-opacity-70 dark:hover:bg-opacity-100 rounded-full p-2 transition-all duration-300 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="custom-next absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 dark:bg-gray-800 dark:bg-opacity-70 dark:hover:bg-opacity-100 rounded-full p-2 transition-all duration-300 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
      
      {/* Custom pagination */}
      {showPagination && banners.length > 1 && (
        <div className="custom-pagination absolute bottom-4 left-0 right-0 z-10 flex justify-center space-x-1"></div>
      )}
      
      {/* Custom styles for the pagination bullets */}
      <style jsx="true">{`
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.6);
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #ffffff;
        }
        .custom-pagination .swiper-pagination-bullet {
          margin: 0 4px;
        }
        @media (max-width: 640px) {
          .custom-prev, .custom-next {
            padding: 6px;
          }
          .custom-prev svg, .custom-next svg {
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default BannerSlider;

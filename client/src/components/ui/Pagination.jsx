import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const isDarkMode = useSelector(selectIsDarkMode);

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pageNumbers.push('...');
    }
    
    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Add last page if there are more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  // Shared button styles
  const buttonBaseClass = `px-3 py-1 mx-0.5 rounded-md text-sm font-medium`;
  const activeButtonClass = `bg-primary-600 text-white`;
  const inactiveButtonClass = isDarkMode 
    ? `bg-gray-700 text-white hover:bg-gray-600` 
    : `bg-white text-gray-700 hover:bg-gray-100`;
  const disabledButtonClass = isDarkMode
    ? `bg-gray-800 text-gray-500 cursor-not-allowed`
    : `bg-gray-100 text-gray-400 cursor-not-allowed`;

  return (
    <div className="flex items-center justify-center">
      {/* Previous button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${buttonBaseClass} ${
          currentPage === 1 ? disabledButtonClass : inactiveButtonClass
        }`}
        aria-label="Previous page"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
      </button>
      
      {/* Page numbers */}
      {pageNumbers.map((pageNumber, index) => (
        <React.Fragment key={index}>
          {pageNumber === '...' ? (
            <span className={`${buttonBaseClass} ${inactiveButtonClass}`}>...</span>
          ) : (
            <button
              onClick={() => pageNumber !== currentPage && onPageChange(pageNumber)}
              className={`${buttonBaseClass} ${
                pageNumber === currentPage ? activeButtonClass : inactiveButtonClass
              }`}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
              aria-label={`Page ${pageNumber}`}
            >
              {pageNumber}
            </button>
          )}
        </React.Fragment>
      ))}
      
      {/* Next button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${buttonBaseClass} ${
          currentPage === totalPages ? disabledButtonClass : inactiveButtonClass
        }`}
        aria-label="Next page"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;

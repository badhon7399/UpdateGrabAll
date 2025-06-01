import React from 'react';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const spinnerClasses = `${sizeClasses[size]} rounded-full border-gray-300 border-t-primary-600 animate-spin`;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
        <div className={spinnerClasses}></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className={spinnerClasses}></div>
    </div>
  );
};

export default LoadingSpinner;

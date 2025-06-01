import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';

const AddressList = ({ addresses = [], onEdit, onDelete }) => {
  const isDarkMode = useSelector(selectIsDarkMode);

  if (!addresses || addresses.length === 0) {
    return (
      <div className={`p-6 rounded-lg text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <p className="mb-4">You don't have any saved addresses yet.</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add an address to make checkout faster.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <div 
          key={address._id} 
          className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">{address.fullName}</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                {address.address}
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                {address.city}, {address.postalCode}
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                {address.division}
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                {address.phone}
              </p>
              
              {/* Default address badge */}
              {address.isDefault && (
                <span className="mt-2 inline-block px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded dark:bg-primary-900/30 dark:text-primary-300">
                  Default Address
                </span>
              )}
            </div>
            
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => onEdit(address)}
                className={`p-2 rounded-md ${
                  isDarkMode 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-gray-500 dark:text-gray-400" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              
              <button
                onClick={() => onDelete(address._id)}
                className={`p-2 rounded-md ${
                  isDarkMode 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-red-500" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;

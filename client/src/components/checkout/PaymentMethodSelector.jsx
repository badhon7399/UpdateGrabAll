import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';

const PaymentMethodSelector = ({ selected, onSelect }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const [transactionId, setTransactionId] = useState('');
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState(null);
  
  // Store owner's payment account numbers
  const paymentAccounts = {
    bkash: '01712-345678',
    nagad: '01812-345678',
    rocket: '01912-345678'
  };
  
  const paymentMethods = [
    {
      id: 'cash-on-delivery',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      type: 'standard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'bkash',
      name: 'bKash',
      description: 'Pay via bKash to our merchant number',
      type: 'mobile_banking',
      accountNumber: paymentAccounts.bkash,
      instructions: 'Send the total amount to this bKash number and provide the Transaction ID below',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'nagad',
      name: 'Nagad',
      description: 'Pay via Nagad to our merchant number',
      type: 'mobile_banking',
      accountNumber: paymentAccounts.nagad,
      instructions: 'Send the total amount to this Nagad number and provide the Transaction ID below',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'rocket',
      name: 'Rocket',
      description: 'Pay via Rocket to our merchant number',
      type: 'mobile_banking',
      accountNumber: paymentAccounts.rocket,
      instructions: 'Send the total amount to this Rocket number and provide the Transaction ID below',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  // Handle payment method selection
  const handleSelectPayment = (method) => {
    setSelectedPaymentDetails(method);
    // Only update the selected payment if it's a non-mobile banking method
    // Otherwise, we'll set it when the transaction ID is submitted
    if (method.type !== 'mobile_banking') {
      onSelect(method.name);
    }
  };

  // Handle transaction ID submission
  const handleTransactionSubmit = () => {
    if (!transactionId || transactionId.trim() === '') {
      alert('Please enter the transaction ID');
      return;
    }
    
    // Send both the payment method and transaction ID
    onSelect({
      method: selectedPaymentDetails.name,
      transactionId: transactionId,
      accountNumber: selectedPaymentDetails.accountNumber
    });
  };

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <div key={method.id}>
          <div 
            onClick={() => handleSelectPayment(method)}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedPaymentDetails?.id === method.id
                ? `border-primary-600 ${isDarkMode ? 'bg-primary-900/20' : 'bg-primary-50'}`
                : `${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'}`
            }`}
          >
            <div className="flex items-center">
              <div className={`mr-4 ${selectedPaymentDetails?.id === method.id ? 'text-primary-600' : ''}`}>
                {method.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{method.name}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {method.description}
                </p>
              </div>
              
              <div className="ml-4">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedPaymentDetails?.id === method.id
                    ? 'border-primary-600'
                    : `${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`
                }`}>
                  {selectedPaymentDetails?.id === method.id && (
                    <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Show mobile banking details for the selected payment method */}
          {selectedPaymentDetails?.id === method.id && method.type === 'mobile_banking' && (
            <div className={`mt-2 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="mb-4">
                <p className="font-medium mb-1">Account Number:</p>
                <div className={`p-3 rounded flex justify-between items-center ${isDarkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}>
                  <span>{method.accountNumber}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(method.accountNumber)}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <p className="text-sm mb-3">{method.instructions}</p>
              
              <div className="mb-4">
                <label htmlFor="transactionId" className="block text-sm font-medium mb-1">Transaction ID</label>
                <input
                  type="text"
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className={`w-full p-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
                  placeholder="Enter your transaction ID"
                />
              </div>
              
              <button
                onClick={handleTransactionSubmit}
                disabled={!transactionId}
                className={`w-full py-2 rounded-md font-medium ${
                  !transactionId
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                Confirm Payment
              </button>
            </div>
          )}
        </div>
      ))}
      
      {/* Continue button - only show for non-mobile banking methods */}
      {selectedPaymentDetails && selectedPaymentDetails.type === 'standard' && (
        <div className="mt-6">
          <button
            onClick={() => onSelect(selectedPaymentDetails.name)}
            className="w-full py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
          >
            Continue to Review Order
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;

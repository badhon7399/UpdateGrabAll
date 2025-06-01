import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../features/ui/uiSlice';

const CheckoutSteps = ({ activeStep, onStepClick }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  
  const steps = [
    { number: 1, name: 'Shipping' },
    { number: 2, name: 'Payment' },
    { number: 3, name: 'Review Order' }
  ];

  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          {/* Step item */}
          <div className="flex items-center">
            <button
              onClick={() => step.number < activeStep && onStepClick(step.number)}
              className={`flex flex-col items-center ${step.number < activeStep ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {/* Step circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.number === activeStep
                    ? 'bg-primary-600 text-white'
                    : step.number < activeStep
                    ? 'bg-green-500 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.number < activeStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              
              {/* Step name */}
              <span
                className={`mt-1 text-sm ${
                  step.number === activeStep
                    ? 'font-semibold text-primary-600'
                    : step.number < activeStep
                    ? 'text-green-500'
                    : isDarkMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                {step.name}
              </span>
            </button>
          </div>
          
          {/* Connector line between steps */}
          {index < steps.length - 1 && (
            <div
              className={`w-10 h-0.5 mx-2 ${
                steps[index + 1].number <= activeStep
                  ? 'bg-green-500'
                  : isDarkMode
                  ? 'bg-gray-700'
                  : 'bg-gray-200'
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;

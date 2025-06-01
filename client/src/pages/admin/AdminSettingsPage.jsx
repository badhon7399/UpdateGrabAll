import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  useGetSettingsQuery, 
  useUpdateSettingsMutation
} from '../../features/api/apiSlice';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminSettingsPage = () => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const [activeTab, setActiveTab] = useState('general');
  
  // Fetch settings
  const { data: settings, isLoading, error } = useGetSettingsQuery();
  
  // Mutation
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
  
  // Form states
  const [formData, setFormData] = useState({
    general: {
      storeName: '',
      storeEmail: '',
      storePhone: '',
      storeAddress: '',
      logoUrl: '',
      faviconUrl: '',
      currencySymbol: '৳',
      taxRate: 15
    },
    shipping: {
      enableFreeShipping: false,
      freeShippingThreshold: 1000,
      flatRate: 100,
      localDelivery: true,
      localDeliveryFee: 60
    },
    payment: {
      cashOnDelivery: true,
      bkashEnabled: false,
      bkashNumber: '',
      nagadEnabled: false,
      nagadNumber: '',
      sslCommerzEnabled: false
    }
  });
  
  // Update form values when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        general: {
          ...formData.general,
          ...settings.general
        },
        shipping: {
          ...formData.shipping,
          ...settings.shipping
        },
        payment: {
          ...formData.payment,
          ...settings.payment
        }
      });
    }
  }, [settings]);
  
  // Handle form input changes
  const handleChange = (section, name, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [name]: value
      }
    });
  };
  
  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings({ 
        section: activeTab, 
        settings: formData[activeTab] 
      }).unwrap();
      alert(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings updated successfully`);
    } catch (err) {
      alert(`Failed to update settings: ${err.message}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800'}`}>
        <h2 className="text-lg font-semibold mb-2">Error Loading Settings</h2>
        <p>Failed to load settings. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Store Settings</h1>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('general')}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'general'
                  ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-500 dark:border-primary-500'
                  : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              General
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('shipping')}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'shipping'
                  ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-500 dark:border-primary-500'
                  : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              Shipping
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('payment')}
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'payment'
                  ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-500 dark:border-primary-500'
                  : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              Payment Methods
            </button>
          </li>
        </ul>
      </div>
      
      {/* Settings Form */}
      <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
        <form onSubmit={handleSubmit}>
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">General Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="storeName" className="block text-sm font-medium mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    id="storeName"
                    value={formData.general.storeName}
                    onChange={(e) => handleChange('general', 'storeName', e.target.value)}
                    className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label htmlFor="storeEmail" className="block text-sm font-medium mb-1">
                    Store Email
                  </label>
                  <input
                    type="email"
                    id="storeEmail"
                    value={formData.general.storeEmail}
                    onChange={(e) => handleChange('general', 'storeEmail', e.target.value)}
                    className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label htmlFor="storePhone" className="block text-sm font-medium mb-1">
                    Store Phone
                  </label>
                  <input
                    type="text"
                    id="storePhone"
                    value={formData.general.storePhone}
                    onChange={(e) => handleChange('general', 'storePhone', e.target.value)}
                    className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label htmlFor="currencySymbol" className="block text-sm font-medium mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    id="currencySymbol"
                    value={formData.general.currencySymbol}
                    onChange={(e) => handleChange('general', 'currencySymbol', e.target.value)}
                    className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label htmlFor="taxRate" className="block text-sm font-medium mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    id="taxRate"
                    value={formData.general.taxRate}
                    onChange={(e) => handleChange('general', 'taxRate', parseFloat(e.target.value))}
                    className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="storeAddress" className="block text-sm font-medium mb-1">
                    Store Address
                  </label>
                  <textarea
                    id="storeAddress"
                    value={formData.general.storeAddress}
                    onChange={(e) => handleChange('general', 'storeAddress', e.target.value)}
                    rows="2"
                    className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="logoUrl" className="block text-sm font-medium mb-1">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    id="logoUrl"
                    value={formData.general.logoUrl}
                    onChange={(e) => handleChange('general', 'logoUrl', e.target.value)}
                    className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label htmlFor="faviconUrl" className="block text-sm font-medium mb-1">
                    Favicon URL
                  </label>
                  <input
                    type="text"
                    id="faviconUrl"
                    value={formData.general.faviconUrl}
                    onChange={(e) => handleChange('general', 'faviconUrl', e.target.value)}
                    className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Shipping Settings */}
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Shipping Settings</h2>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="enableFreeShipping"
                  checked={formData.shipping.enableFreeShipping}
                  onChange={(e) => handleChange('shipping', 'enableFreeShipping', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="enableFreeShipping" className="ml-2 block text-sm font-medium">
                  Enable Free Shipping
                </label>
              </div>
              
              {formData.shipping.enableFreeShipping && (
                <div className="ml-6 mb-4">
                  <label htmlFor="freeShippingThreshold" className="block text-sm font-medium mb-1">
                    Free Shipping Threshold (৳)
                  </label>
                  <input
                    type="number"
                    id="freeShippingThreshold"
                    value={formData.shipping.freeShippingThreshold}
                    onChange={(e) => handleChange('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                    className={`w-full max-w-xs px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="flatRate" className="block text-sm font-medium mb-1">
                  Flat Rate Shipping Fee (৳)
                </label>
                <input
                  type="number"
                  id="flatRate"
                  value={formData.shipping.flatRate}
                  onChange={(e) => handleChange('shipping', 'flatRate', parseFloat(e.target.value))}
                  className={`w-full max-w-xs px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="localDelivery"
                  checked={formData.shipping.localDelivery}
                  onChange={(e) => handleChange('shipping', 'localDelivery', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="localDelivery" className="ml-2 block text-sm font-medium">
                  Enable Local Delivery
                </label>
              </div>
              
              {formData.shipping.localDelivery && (
                <div className="ml-6 mb-4">
                  <label htmlFor="localDeliveryFee" className="block text-sm font-medium mb-1">
                    Local Delivery Fee (৳)
                  </label>
                  <input
                    type="number"
                    id="localDeliveryFee"
                    value={formData.shipping.localDeliveryFee}
                    onChange={(e) => handleChange('shipping', 'localDeliveryFee', parseFloat(e.target.value))}
                    className={`w-full max-w-xs px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="cashOnDelivery"
                    checked={formData.payment.cashOnDelivery}
                    onChange={(e) => handleChange('payment', 'cashOnDelivery', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="cashOnDelivery" className="ml-2 block text-sm font-medium">
                    Cash on Delivery
                  </label>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="bkashEnabled"
                      checked={formData.payment.bkashEnabled}
                      onChange={(e) => handleChange('payment', 'bkashEnabled', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="bkashEnabled" className="ml-2 block text-sm font-medium">
                      Enable bKash
                    </label>
                  </div>
                  
                  {formData.payment.bkashEnabled && (
                    <div className="ml-6 mb-4">
                      <label htmlFor="bkashNumber" className="block text-sm font-medium mb-1">
                        bKash Merchant Number
                      </label>
                      <input
                        type="text"
                        id="bkashNumber"
                        value={formData.payment.bkashNumber}
                        onChange={(e) => handleChange('payment', 'bkashNumber', e.target.value)}
                        className={`w-full max-w-xs px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="nagadEnabled"
                      checked={formData.payment.nagadEnabled}
                      onChange={(e) => handleChange('payment', 'nagadEnabled', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="nagadEnabled" className="ml-2 block text-sm font-medium">
                      Enable Nagad
                    </label>
                  </div>
                  
                  {formData.payment.nagadEnabled && (
                    <div className="ml-6 mb-4">
                      <label htmlFor="nagadNumber" className="block text-sm font-medium mb-1">
                        Nagad Merchant Number
                      </label>
                      <input
                        type="text"
                        id="nagadNumber"
                        value={formData.payment.nagadNumber}
                        onChange={(e) => handleChange('payment', 'nagadNumber', e.target.value)}
                        className={`w-full max-w-xs px-4 py-2 rounded-md border focus:ring-2 focus:ring-primary-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="sslCommerzEnabled"
                      checked={formData.payment.sslCommerzEnabled}
                      onChange={(e) => handleChange('payment', 'sslCommerzEnabled', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sslCommerzEnabled" className="ml-2 block text-sm font-medium">
                      Enable SSLCommerz (Credit/Debit Cards)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <span className="flex items-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving...
                </span>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettingsPage;

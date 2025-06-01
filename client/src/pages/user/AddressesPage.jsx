import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { 
  useGetMeQuery,
  useAddAddressMutation, 
  useUpdateAddressMutation, 
  useDeleteAddressMutation 
} from '../../features/api/apiSlice';

const AddressesPage = () => {
  const user = useSelector(selectCurrentUser);
  const isDarkMode = useSelector(selectIsDarkMode);
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Bangladesh',
    isDefault: false
  });

  // Fetch user data with addresses using RTK Query
  const { 
    data: userData, 
    isLoading: isLoadingUser, 
    isError: isUserError 
  } = useGetMeQuery();

  // Setup mutations for address operations
  const [addAddress, { isLoading: isAddingAddress }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdatingAddress }] = useUpdateAddressMutation();
  const [deleteAddress, { isLoading: isDeletingAddress }] = useDeleteAddressMutation();

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  // Update addresses when user data is loaded
  useEffect(() => {
    if (userData && userData.addresses) {
      setAddresses(userData.addresses);
      setIsLoading(false);
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'Bangladesh',
      isDefault: false
    });
    setEditingAddress(null);
    setShowAddForm(false);
  };

  const handleEditAddress = (address) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setEditingAddress(address._id || address.id);
    setShowAddForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(addressId).unwrap();
      toast.success('Address deleted successfully');
      
      // Update local state to remove the deleted address
      setAddresses(addresses.filter(addr => (addr._id || addr.id) !== addressId));
    } catch (error) {
      toast.error('Failed to delete address');
      console.error(error);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      // Find the address we want to set as default
      const addressToUpdate = addresses.find(addr => (addr._id || addr.id) === addressId);
      
      if (addressToUpdate) {
        // Update the address with isDefault set to true
        await updateAddress({ 
          id: addressId, 
          ...addressToUpdate,
          isDefault: true 
        }).unwrap();
        
        toast.success('Default address updated');
        
        // Update local state to reflect the change
        setAddresses(addresses.map(addr => ({
          ...addr,
          isDefault: (addr._id || addr.id) === addressId
        })));
      }
    } catch (error) {
      toast.error('Failed to update default address');
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingAddress) {
        // Update existing address
        await updateAddress({
          id: editingAddress,
          ...formData
        }).unwrap();
        
        toast.success('Address updated successfully');
        
        // Update local state
        setAddresses(addresses.map(addr => 
          (addr._id || addr.id) === editingAddress ? { ...formData, _id: editingAddress } : addr
        ));
      } else {
        // Add new address
        const result = await addAddress(formData).unwrap();
        
        // If this is the first address or marked as default, we need to ensure it's set as default
        const newAddress = result.address || { ...formData, _id: Date.now().toString() };
        
        toast.success('Address added successfully');
        
        // Update local state
        if (formData.isDefault) {
          // If the new address is default, update all other addresses to non-default
          setAddresses([
            ...addresses.map(addr => ({ ...addr, isDefault: false })),
            { ...newAddress, isDefault: true }
          ]);
        } else if (addresses.length === 0) {
          // If this is the first address, make it default regardless
          setAddresses([{ ...newAddress, isDefault: true }]);
        } else {
          // Just add the new address to the list
          setAddresses([...addresses, newAddress]);
        }
      }
      
      // Reset form and close it
      resetForm();
    } catch (error) {
      toast.error('Failed to save address');
      console.error(error);
    }
  };

  // Determine if any loading state is active
  const isProcessing = isLoadingUser || isAddingAddress || isUpdatingAddress || isDeletingAddress;

  if (!user) return <LoadingSpinner fullScreen />;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Addresses</h1>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className={`px-4 py-2 rounded-md ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}
            >
              Add New Address
            </button>
          )}
        </div>
        
        {isLoading && addresses.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Address Form */}
            {showAddForm && (
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
                <h2 className="text-xl font-semibold mb-4">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded-md border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                            : 'bg-white border-gray-300 focus:border-blue-500'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded-md border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                            : 'bg-white border-gray-300 focus:border-blue-500'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded-md border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                            : 'bg-white border-gray-300 focus:border-blue-500'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded-md border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                            : 'bg-white border-gray-300 focus:border-blue-500'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded-md border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                            : 'bg-white border-gray-300 focus:border-blue-500'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded-md border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                            : 'bg-white border-gray-300 focus:border-blue-500'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      >
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="India">India</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={formData.isDefault}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2">Set as default address</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className={`px-4 py-2 rounded-md ${
                        isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                      } transition-colors`}
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-md ${
                        isDarkMode
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white transition-colors`}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Addresses List */}
            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map(address => (
                  <div 
                    key={address._id || address.id} 
                    className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 relative`}
                  >
                    {address.isDefault && (
                      <span className="absolute top-4 right-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Default
                      </span>
                    )}
                    
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">{address.fullName}</h3>
                      <p className="text-sm">{address.phone}</p>
                    </div>
                    
                    <address className="not-italic mb-6">
                      <p>{address.address}</p>
                      <p>{address.city}, {address.postalCode}</p>
                      <p>{address.country}</p>
                    </address>
                    
                    <div className="flex justify-between">
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEditAddress(address)}
                          className={`px-3 py-1 rounded ${
                            isDarkMode
                              ? 'bg-gray-700 hover:bg-gray-600'
                              : 'bg-gray-200 hover:bg-gray-300'
                          } text-sm transition-colors`}
                          disabled={isProcessing}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address._id || address.id)}
                          className={`px-3 py-1 rounded ${
                            isDarkMode
                              ? 'bg-red-900 hover:bg-red-800'
                              : 'bg-red-100 hover:bg-red-200'
                          } ${isDarkMode ? 'text-red-200' : 'text-red-600'} text-sm transition-colors`}
                          disabled={isProcessing}
                        >
                          Delete
                        </button>
                      </div>
                      
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(address._id || address.id)}
                          className={`px-3 py-1 rounded ${
                            isDarkMode
                              ? 'bg-blue-900 hover:bg-blue-800'
                              : 'bg-blue-100 hover:bg-blue-200'
                          } ${isDarkMode ? 'text-blue-200' : 'text-blue-600'} text-sm transition-colors`}
                          disabled={isProcessing}
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center`}>
                <p className="text-lg mb-4">You don't have any saved addresses yet.</p>
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className={`px-4 py-2 rounded-md ${
                      isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white transition-colors`}
                  >
                    Add Your First Address
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AddressesPage;

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  updateUser,
  logout,
} from "../features/auth/authSlice";
import { selectIsDarkMode, setNotification } from "../features/ui/uiSlice";
import {
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useGetOrdersQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useLogoutMutation,
} from "../features/api/apiSlice";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import OrdersList from "../components/profile/OrdersList";
import ProfileInfoForm from "../components/profile/ProfileInfoForm";
import ChangePasswordForm from "../components/profile/ChangePasswordForm";
import AddressList from "../components/profile/AddressList";
import AddressForm from "../components/profile/AddressForm";

const ProfilePage = () => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isDarkMode = useSelector(selectIsDarkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for active tab
  const [activeTab, setActiveTab] = useState("profile");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // API mutations
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] =
    useUpdatePasswordMutation();
  const [addAddress, { isLoading: isAddingAddress }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdatingAddress }] =
    useUpdateAddressMutation();
  const [deleteAddress, { isLoading: isDeletingAddress }] =
    useDeleteAddressMutation();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  // Fetch user's orders
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useGetOrdersQuery({}, { skip: activeTab !== "orders" });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=profile" replace />;
  }

  // Handle profile update
  const handleProfileUpdate = async (profileData) => {
    try {
      const response = await updateProfile(profileData).unwrap();

      // Update local state
      dispatch(updateUser(response.user));

      dispatch(
        setNotification({
          type: "success",
          message: "Profile updated successfully",
          duration: 3000,
        })
      );
    } catch (error) {
      dispatch(
        setNotification({
          type: "error",
          message: error.data?.message || "Failed to update profile",
          duration: 5000,
        })
      );
    }
  };

  // Handle password change
  const handlePasswordChange = async (passwordData) => {
    try {
      await updatePassword(passwordData).unwrap();

      dispatch(
        setNotification({
          type: "success",
          message: "Password updated successfully",
          duration: 3000,
        })
      );
    } catch (error) {
      dispatch(
        setNotification({
          type: "error",
          message: error.data?.message || "Failed to update password",
          duration: 5000,
        })
      );
    }
  };

  // Handle address operations
  const handleAddAddress = async (addressData) => {
    try {
      await addAddress(addressData).unwrap();

      dispatch(
        setNotification({
          type: "success",
          message: "Address added successfully",
          duration: 3000,
        })
      );

      setShowAddressForm(false);
    } catch (error) {
      dispatch(
        setNotification({
          type: "error",
          message: error.data?.message || "Failed to add address",
          duration: 5000,
        })
      );
    }
  };

  const handleUpdateAddress = async (addressData) => {
    try {
      await updateAddress({
        id: editingAddress._id,
        ...addressData,
      }).unwrap();

      dispatch(
        setNotification({
          type: "success",
          message: "Address updated successfully",
          duration: 3000,
        })
      );

      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (error) {
      dispatch(
        setNotification({
          type: "error",
          message: error.data?.message || "Failed to update address",
          duration: 5000,
        })
      );
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(addressId).unwrap();

      dispatch(
        setNotification({
          type: "success",
          message: "Address deleted successfully",
          duration: 3000,
        })
      );
    } catch (error) {
      dispatch(
        setNotification({
          type: "error",
          message: error.data?.message || "Failed to delete address",
          duration: 5000,
        })
      );
    }
  };

  // Handle address form
  const handleAddressFormSubmit = (addressData) => {
    if (editingAddress) {
      handleUpdateAddress(addressData);
    } else {
      handleAddAddress(addressData);
    }
  };

  const startEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const cancelAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await logoutApi().unwrap();

      // Dispatch the logout action to clear local state
      dispatch(logout());

      // Show success notification
      dispatch(
        setNotification({
          type: "success",
          message: "Logged out successfully",
          duration: 3000,
        })
      );

      // Redirect to home page
      navigate("/");
    } catch (error) {
      // If API call fails, still logout locally
      dispatch(logout());
      navigate("/");

      dispatch(
        setNotification({
          type: "error",
          message: error.data?.message || "Error during logout",
          duration: 5000,
        })
      );
    }
  };

  const isLoading =
    isUpdatingProfile ||
    isUpdatingPassword ||
    isAddingAddress ||
    isUpdatingAddress ||
    isDeletingAddress ||
    isLoggingOut;

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar navigation */}
          <div className="md:col-span-1">
            <div
              className={`rounded-lg shadow-md ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto`}
            >
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`p-3 rounded-md text-left ${
                    activeTab === "profile"
                      ? "bg-primary-600 text-white"
                      : `${
                          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`p-3 rounded-md text-left ${
                    activeTab === "addresses"
                      ? "bg-primary-600 text-white"
                      : `${
                          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`
                  }`}
                >
                  Addresses
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`p-3 rounded-md text-left ${
                    activeTab === "orders"
                      ? "bg-primary-600 text-white"
                      : `${
                          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`p-3 rounded-md text-left ${
                    activeTab === "password"
                      ? "bg-primary-600 text-white"
                      : `${
                          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`
                  }`}
                >
                  Change Password
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <button
                  onClick={handleLogout}
                  className={`p-3 rounded-md text-left text-red-600 dark:text-red-400 ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="md:col-span-3">
            <div
              className={`rounded-lg shadow-md ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } p-6`}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 z-10 rounded-lg">
                  <LoadingSpinner size="lg" />
                </div>
              )}

              {/* Profile Information Tab */}
              {activeTab === "profile" && (
                <>
                  <h2 className="text-xl font-bold mb-6">
                    Profile Information
                  </h2>
                  <ProfileInfoForm user={user} onSubmit={handleProfileUpdate} />
                </>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">My Addresses</h2>
                    {!showAddressForm && (
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                      >
                        Add New Address
                      </button>
                    )}
                  </div>

                  {showAddressForm ? (
                    <>
                      <h3 className="font-semibold mb-4">
                        {editingAddress ? "Edit Address" : "Add New Address"}
                      </h3>
                      <AddressForm
                        initialValues={editingAddress || {}}
                        onSubmit={handleAddressFormSubmit}
                        onCancel={cancelAddressForm}
                      />
                    </>
                  ) : (
                    <AddressList
                      addresses={user?.addresses || []}
                      onEdit={startEditAddress}
                      onDelete={handleDeleteAddress}
                    />
                  )}
                </>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <>
                  <h2 className="text-xl font-bold mb-6">My Orders</h2>

                  {isLoadingOrders ? (
                    <div className="py-8 flex justify-center">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : ordersError ? (
                    <div
                      className={`p-4 rounded-lg ${
                        isDarkMode ? "bg-red-900" : "bg-red-100"
                      } text-center`}
                    >
                      <p
                        className={isDarkMode ? "text-red-200" : "text-red-600"}
                      >
                        Error loading orders. Please try again later.
                      </p>
                    </div>
                  ) : ordersData?.orders?.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        You haven't placed any orders yet.
                      </p>
                    </div>
                  ) : (
                    <OrdersList orders={ordersData?.orders || []} />
                  )}
                </>
              )}

              {/* Change Password Tab */}
              {activeTab === "password" && (
                <>
                  <h2 className="text-xl font-bold mb-6">Change Password</h2>
                  <ChangePasswordForm onSubmit={handlePasswordChange} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

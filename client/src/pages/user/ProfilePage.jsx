import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, logout } from '../../features/auth/authSlice';
import { selectIsDarkMode } from '../../features/ui/uiSlice';
import { useUpdateProfileMutation, useUpdatePasswordMutation } from '../../features/api/apiSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ProfileForm from '../../components/profile/ProfileForm';
import UserStats from '../../components/profile/UserStats';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const user = useSelector(selectCurrentUser);
  const isDarkMode = useSelector(selectIsDarkMode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Get the update profile mutation hook
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  if (!user) return <LoadingSpinner fullScreen />;

  const handleProfileUpdate = async (profileData) => {
    try {
      // Handle password separately if provided
      if (profileData.currentPassword && profileData.newPassword) {
        await updatePassword({
          currentPassword: profileData.currentPassword,
          newPassword: profileData.newPassword
        }).unwrap();
        
        // Remove password fields before updating profile
        delete profileData.currentPassword;
        delete profileData.newPassword;
      }
      
      // Update user profile with remaining data
      if (Object.keys(profileData).length > 0) {
        const result = await updateProfile(profileData).unwrap();
        
        // Check for successful response
        if (result && (result.success !== false)) {
          toast.success('Profile updated successfully');
        } else {
          throw new Error(result.message || 'Failed to update profile');
        }
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.data?.message || error.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success('You have been logged out successfully');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
          <button
            onClick={handleLogout}
            className={`px-4 py-2 rounded-md font-medium text-white ${
              isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
            } transition-colors`}
          >
            Logout
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'profile'
                  ? isDarkMode
                    ? 'border-blue-400 text-blue-400'
                    : 'border-blue-600 text-blue-600'
                  : 'border-transparent hover:text-gray-400'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'stats'
                  ? isDarkMode
                    ? 'border-blue-400 text-blue-400'
                    : 'border-blue-600 text-blue-600'
                  : 'border-transparent hover:text-gray-400'
              }`}
            >
              Account Statistics
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          {activeTab === 'profile' ? (
            <ProfileForm 
              user={user} 
              onSubmit={handleProfileUpdate} 
              isLoading={isLoading || isUpdatingPassword}
              isDarkMode={isDarkMode}
            />
          ) : (
            <UserStats 
              user={user}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

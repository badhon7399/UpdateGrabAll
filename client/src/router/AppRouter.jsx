import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin } from '../features/auth/authSlice';
import { selectIsDarkMode } from '../features/ui/uiSlice';

// Layout components
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';

// Page components
import HomePage from '../pages/HomePage';
import ProductListingPage from '../pages/ProductListingPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import CategoriesPage from '../pages/CategoriesPage';
import WishlistPage from '../pages/WishlistPage';

// Admin pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminProductFormPage from '../pages/admin/AdminProductFormPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from '../pages/admin/AdminOrderDetailPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminBannersPage from '../pages/admin/AdminBannersPage';

// Other pages
import NotFoundPage from '../pages/NotFoundPage';

// Protected route wrapper
const ProtectedRoute = ({ children, isAdmin = false }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userIsAdmin = useSelector(selectIsAdmin);
  
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${window.location.pathname}`} replace />;
  }
  
  if (isAdmin && !userIsAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRouter = () => {
  const isDarkMode = useSelector(selectIsDarkMode);
  
  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  return (
    <Router>
      <Routes>
        {/* Public routes with main layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListingPage />} />
          <Route path="products/:slug" element={<ProductDetailPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        
        {/* Protected routes with main layout */}
        <Route path="/" element={<MainLayout />}>
          <Route 
            path="checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="orders/:orderId" 
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>
        
        {/* Authentication routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        </Route>
        
        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute isAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminProductFormPage />} />
          <Route path="products/edit/:id" element={<AdminProductFormPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="banners" element={<AdminBannersPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;

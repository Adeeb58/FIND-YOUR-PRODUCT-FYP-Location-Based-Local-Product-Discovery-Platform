// src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/common/ErrorBoundary';

// Layouts
import MainLayout from './layouts/MainLayout';
import { VendorDashboardLayout } from './layouts/VendorDashboardLayout';
import { UserDashboardLayout } from './layouts/UserDashboardLayout';
import { AdminDashboardLayout } from './layouts/AdminDashboardLayout';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import VendorDetailsPage from './pages/VendorDetailsPage';
import CategoriesPage from './pages/CategoriesPage';
import VendorPage from './pages/VendorPage';
import VerifiedVendorsPage from './pages/VerifiedVendorsPage';
import FastDeliveryPage from './pages/FastDeliveryPage';
import PriceComparisonPage from './pages/PriceComparisonPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import NotFoundPage from './pages/NotFoundPage';

// Company Pages
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import BlogPage from './pages/BlogPage';
import PressPage from './pages/PressPage';

// Shop Pages
import DealsPage from './pages/DealsPage';
import NewArrivalsPage from './pages/NewArrivalsPage';

// Help & Support Pages
import HelpCenterPage from './pages/HelpCenterPage';
import ShippingPage from './pages/ShippingPage';
import ReturnsPage from './pages/ReturnsPage';
import ContactPage from './pages/ContactPage';

// Protected Routes
import ProtectedRoute from './routes/ProtectedRoute';

// Vendor Dashboard Pages
import DashboardPage from './pages/vendor/DashboardPage';
import MyProductsPage from './pages/vendor/MyProductsPage';
import ProfileSettingPage from './pages/vendor/ProfileSettingPage';
import ProductFormPage from './pages/vendor/ProductFormPage';

// User Dashboard Pages
import UserProfilePage from './pages/user/UserProfilePage';
import UserFavoritesPage from './pages/user/UserFavoritesPage';

// Admin Dashboard Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import VendorManagementPage from './pages/admin/VendorManagementPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';

// UI Components
import { Button } from './components/ui/button';

import { CartProvider } from './context/CartContext';

function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <Routes>
          {/* Main Application Routes (public) */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchResultsPage />} />
            <Route path="product/:productId" element={<ProductDetailsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="vendors" element={<VendorPage />} />
            <Route path="verified-vendors" element={<VerifiedVendorsPage />} />
            <Route path="fast-delivery" element={<FastDeliveryPage />} />
            <Route path="price-comparison" element={<PriceComparisonPage />} />
            <Route path="vendor/:vendorId" element={<VendorDetailsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="orders" element={<OrderHistoryPage />} />

            {/* Company Routes */}
            <Route path="about" element={<AboutPage />} />
            <Route path="careers" element={<CareersPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="press" element={<PressPage />} />

            {/* Shop Routes */}
            <Route path="deals" element={<DealsPage />} />
            <Route path="new" element={<NewArrivalsPage />} />

            {/* Support Routes */}
            <Route path="help" element={<HelpCenterPage />} />
            <Route path="shipping" element={<ShippingPage />} />
            <Route path="returns" element={<ReturnsPage />} />
            <Route path="contact" element={<ContactPage />} />

            {/* Authentication Routes */}
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
          </Route>

          {/* User Dashboard Routes (Protected) */}
          <Route path="/user" element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route element={<UserDashboardLayout />}>
              <Route path="profile" element={<UserProfilePage />} />
              <Route path="favorites" element={<UserFavoritesPage />} />
            </Route>
          </Route>

          {/* Vendor Dashboard Routes (Protected) */}
          <Route path="/vendor" element={<ProtectedRoute allowedRoles={['vendor']} />}>
            <Route element={<VendorDashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<MyProductsPage />} />
              <Route path="products/new" element={<ProductFormPage />} />
              <Route path="products/edit/:productId" element={<ProductFormPage />} />
              <Route path="profile" element={<ProfileSettingPage />} />
            </Route>
          </Route>

          {/* Admin Dashboard Routes (Protected) */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminDashboardLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="vendors" element={<VendorManagementPage />} />
              <Route path="categories" element={<CategoryManagementPage />} />
            </Route>
          </Route>

          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster />
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;

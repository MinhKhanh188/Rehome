// front-end/src/App.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/pages/general/Home';
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';
import ForgotPassword from './components/pages/Auth/ForgotPassword';
import Products from './components/pages/market/Products';
import ProductDetails from './components/pages/market/ProductDetails';
import Dashboard from './components/pages/dashboard/Dashboard';
import AdminDashboard from './components/pages/admin/AdminDashboard';
import AdminLogin from './components/pages/admin/AdminLogin';
import ProtectedLayout from './components/utils/ProtectedLayout';
import PleaseLoginFirst from './components/pages/general/PleaseLoginFirst';
import ResetPassword from './components/pages/Auth/ResetPassword';
import Payment from './components/pages/Payment';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/products" element={<Products />} />
        <Route path="/payment" element={<Payment />} />

        
        {/* 🛠️ Single entry for all admin routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/please-login-first" element={<PleaseLoginFirst />} />
        <Route path="/reset-password/:email" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/products/product-details/" element={<ProductDetails />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
      
        </Route>

        {/* ✅ Verified User Routes */}
        <Route element={<ProtectedLayout verifiedOnly={true} />}>
          
        </Route>

        {/* ✅ Admin Routes */}
        <Route element={<ProtectedLayout adminOnly={true} />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
         
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

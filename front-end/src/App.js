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
import AdminLogin from './components/pages/Auth/AdminLogin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/product-details/" element={<ProductDetails />} />

        {/* 🛠️ Single entry for all dashboard routes */}
        <Route path="/dashboard/*" element={<Dashboard />} />
        {/* 🛠️ Single entry for all admin routes */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

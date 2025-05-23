import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import ForgotPassword from './components/pages/ForgotPassword';
import Products from './components/pages/Products';
import Dashboard from './components/pages/Dashboard';
import ProductDetails from './components/pages/ProductDetails';
import Payment from './components/pages/Payment';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/products" element={<Products />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/products/product-details" element={<ProductDetails />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

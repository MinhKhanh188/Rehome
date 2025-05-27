// front-end/src/App.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/pages/general/Home';
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';
import ForgotPassword from './components/pages/Auth/ForgotPassword';
import Products from './components/pages/market/Products';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/products" element={<Products />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

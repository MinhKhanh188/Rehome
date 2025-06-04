// front-end/src/components/pages/admin/AdminDashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboardLayout from './AminDashboardLayout';
import UnverifiedProducts from './UnverifiedProducts';
import VerifiedProducts from './VerifiedProducts';
import UserManagement from './UserManagement';

export default function AdminDashboard() {
  return (
    <div className='dashboard-container'>
     
      <div className='section'
        style={{
          margin: '40px auto',
          maxWidth: '1300px',
          padding: '0 20px',
        }}></div>
      <AdminDashboardLayout>
        <Routes>
          <Route index element={<UnverifiedProducts />} />
          <Route path="verified-products" element={<VerifiedProducts />} />
          <Route path="users" element={<UserManagement />} />
        </Routes>
      </AdminDashboardLayout>
    </div>
  );
}
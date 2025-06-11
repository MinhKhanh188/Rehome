// src/utils/ProtectedLayout.js
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

export default function ProtectedLayout({ adminOnly = false, verifiedOnly = false }) {
  const user = JSON.parse(localStorage.getItem('Rehomeusers'));

  if (!user) return <Navigate to="/please-login-first" />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" />;
  if (verifiedOnly && !user.isVerified) return <Navigate to="/" />;

  return <Outlet />;
}

// ProductCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/ProductCard.css';

export const ProductCard = ({ id, title, price, condition, imageUrl, isVip = false }) => {
  const navigate = useNavigate();

  return (
    <div 
      className={`product-card ${isVip ? 'vip' : ''}`}
      onClick={() => navigate(`/product/${id}`)}
    >
      {isVip && (
        <div className="vip-badge">
          VIP
        </div>
      )}
      
      <div className="product-image">
        <img 
          src={imageUrl} 
          alt={title} 
        />
      </div>
      
      <div className="product-info">
        <h3>{title}</h3>
        <div className="product-details">
          <span className="price">${price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
          <span className="condition">{condition}</span>
        </div>
      </div>
    </div>
  );
};
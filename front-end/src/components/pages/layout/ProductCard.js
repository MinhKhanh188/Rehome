// front-end/src/components/pages/layout/ProductCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import '../../css/ProductCard.css';

export const ProductCard = ({ id, title, price, condition, imageUrl, isVip = false, onFavorite }) => {
  const navigate = useNavigate();

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (onFavorite) onFavorite(id);
  };

  return (
    <div 
      className={`product-card ${isVip ? 'vip' : ''}`}
      onClick={() => navigate(`/product?id=${id}`)}
    >
      {/* Nút yêu thích */}
      <button
        className="favorite-btn"
        onClick={handleFavorite}
        title="Thêm vào yêu thích"
      >
        <FaHeart />
      </button>

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
          <span className="price">{price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
          <span className="condition">{condition}</span>
        </div>
      </div>
    </div>
  );
};
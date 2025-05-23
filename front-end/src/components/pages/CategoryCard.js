// CategoryCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CategoryCard.css';

export const CategoryCard = ({ title, icon, path, description }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="category-card"
      onClick={() => navigate(path)}
    >
      <div className="category-icon">
        {icon}
      </div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
};
// Banner.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Banner.css';

export const Banner = ({
  // title = 'Give Your Items a Second Life',
  // subtitle = 'Buy and sell quality secondhand electronics, appliances, and furniture',
  ctaText = 'Start Browsing',
  ctaLink = '/products',
  backgroundImage = '/images/banner2.png'
}) => {
  const navigate = useNavigate();
  
  const defaultBackground = {
    background: 'linear-gradient(to right, #ccfbf1, #99f6e4)'
  };

  return (
    <div className="banner-container" style={backgroundImage ? {} : defaultBackground}>
      <div 
        className="banner-content"
        style={backgroundImage ? { 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: '#f0f4f8',
        } : {}}
      >
        <div className="banner-text">
          {/* <h1>{title}</h1>
          <p>{subtitle}</p>
          <button 
            className="banner-btn"
            onClick={() => navigate(ctaLink)}
          >
            {ctaText}
          </button> */}
        </div>
      </div>
    </div>
  );
};
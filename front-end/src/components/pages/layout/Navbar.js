// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Dropdown, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import '../../css/Navbar.css';
import { NAME, NAME_CONFIG } from '../../../config';

// Thêm danh sách tỉnh thành Việt Nam
const VIETNAM_PROVINCES = [
  "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "An Giang", "Bà Rịa - Vũng Tàu",
  "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương",
  "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên",
  "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang",
  "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn",
  "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên",
  "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La",
  "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh",
  "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

export const NavbarComponent = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // State cho search tỉnh thành
  const [province, setProvince] = useState('Hà Nội');
  const [provinceInput, setProvinceInput] = useState('Hà Nội');
  const [searchedProvince, setSearchedProvince] = useState('Hà Nội');
  const [showDropdown, setShowDropdown] = useState(false);

useEffect(() => {
  const userData = localStorage.getItem(NAME_CONFIG.USER);

  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);
      setIsLoggedIn(true);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem(NAME_CONFIG.USER); 
      setIsLoggedIn(false);
      setUser(null);
    }
  }

  // Auto-navigate to Hà Nội's products
  navigate(`/products?province=${encodeURIComponent('Hà Nội')}`);
}, []);



  const handleSignOut = () => {
    localStorage.removeItem(NAME_CONFIG.USER);
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  // Xử lý chọn tỉnh thành
  const handleProvinceSelect = (prov) => {
    setProvince(prov);
    setProvinceInput(prov);
    setSearchedProvince(prov);
    setShowDropdown(false);
    // Có thể điều hướng hoặc filter sản phẩm theo tỉnh thành ở đây nếu muốn
    navigate(`/products?province=${encodeURIComponent(prov)}`);
  };

  // Lọc danh sách tỉnh thành theo input
  const filteredProvinces = VIETNAM_PROVINCES.filter(p =>
    p.toLowerCase().includes(provinceInput.toLowerCase())
  );

  return (
    <Navbar bg="light" expand="md" className="custom-navbar">
      <Container fluid className="px-4" style={{ maxWidth: '65%' }}>
        <Navbar.Brand onClick={() => navigate('/')} className="logo-text">
          <img src="/images/logo.png" alt="Logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {navLinks.map((link) => (
              <Nav.Link
                key={link.name}
                onClick={() => navigate(link.path)}
                className="nav-link"
              >
                {link.name}
              </Nav.Link>
            ))}
          </Nav>

          {/* Thanh search tỉnh thành */}
          <div
            className="province-search-wrapper mx-3"
            style={{
              minWidth: 220,
              maxWidth: 320,
              width: 260,
              position: "relative",
              flexShrink: 0
            }}
          >
            <input
              type="text"
              className="form-control province-search-input"
              placeholder="Tìm kiếm tỉnh/thành..."
              value={provinceInput}
              onChange={e => {
                setProvinceInput(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              style={{
                width: "100%",
                borderRadius: "18px",
                paddingLeft: "16px",
                paddingRight: "16px"
              }}
            />
            {showDropdown && filteredProvinces.length > 0 && (
              <ul
                className="dropdown-menu show w-100"
                style={{
                  maxHeight: 250,
                  overflowY: 'auto',
                  position: 'absolute',
                  zIndex: 1000,
                  borderRadius: "14px"
                }}
              >
                {filteredProvinces.map((prov) => (
                  <li key={prov}>
                    <button
                      className="dropdown-item"
                      type="button"
                      style={{ borderRadius: "8px" }}
                      onClick={() => handleProvinceSelect(prov)}
                    >
                      {prov}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="auth-section">
            {isLoading ? (
              <div className="spinner"></div>
            ) : isLoggedIn ? (
              <div className='d-flex'>
                <span className="avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            ) : (
              <>
                <Button variant="link" className="login-btn" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="primary" className="signup-btn-deco" onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
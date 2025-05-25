// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Dropdown, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import '../../css/Navbar.css';
import {NAME, NAME_CONFIG} from '../../../config';

export const NavbarComponent = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

          <div className="auth-section">
            {isLoading ? (
              <div className="spinner"></div>
            ) : isLoggedIn ? (
              // <Dropdown align="end">
              //   <Dropdown.Toggle variant="link" id="dropdown-basic" className="profile-btn">
              <div className='d-flex'>
                <span className="avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                </span>
                
              </div>
              //     <span className="username">
              //       {user?.name || user?.email?.split('@')[0]}
              //     </span>
              //   </Dropdown.Toggle>

              //   <Dropdown.Menu>
              //     <Dropdown.Item onClick={() => navigate('/dashboard')}>Dashboard</Dropdown.Item>
              //     <Dropdown.Item onClick={() => navigate('/profile')}>Profile Settings</Dropdown.Item>
              //     <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
              //   </Dropdown.Menu>
              // </Dropdown>
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
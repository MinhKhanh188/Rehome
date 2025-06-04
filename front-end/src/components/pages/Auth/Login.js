import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import '../../css/Login.css'; // We'll create this CSS file
import { NavbarComponent } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { Eye, EyeOff } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'; // Import the Facebook icon
import axios from 'axios';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();


  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.includes(" ")) {
      setLocalError("Password must not include space");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      const { user, token } = response.data;

      localStorage.setItem(NAME_CONFIG.USER, JSON.stringify(user)); 
      localStorage.setItem(NAME_CONFIG.TOKEN, token);
      setLocalError(null);
      if (user && token) {
      // Kiểm tra quyền admin
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setLocalError(message);
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleSignIn = () => {
    setLoading(true);
    // Add Google sign-in logic here
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  const handleFacebookSignIn = () => {
    setLoading(true);
    // Add Facebook sign-in logic here
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="login-page">
      {/* You can add your Navbar component here */}
      <NavbarComponent />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="login-card shadow">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="login-title">Chào mừng bạn quay trở lại</h2>
                  <p className="login-subtitle">Đăng nhập vào tài khoản Re-home của bạn</p>
                </div>

                {localError && (
                  <Alert variant="danger" className="mb-4">
                    {localError}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="email">
                    <Form.Label>Địa chỉ Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label>Mật khẩu</Form.Label>
                    <div className="password-wrapper">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        variant="link"
                        className="password-toggle"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="remember-me"
                      label="Ghi nhớ đăng nhập"
                    />
                    <a href="/forgotPassword" className="forgot-password">
                      Quên mật khẩu?
                    </a>
                  </div>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-4 login-butt"
                    disabled={loading}
                  >
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </Form>

                <div className="divider">
                  <span>Tiếp tục với</span>
                </div>

                <div className="social-buttons mt-4">
                  <Button
                    variant="outline-secondary"
                    className="google-btn"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                      </g>
                    </svg>
                    Google
                  </Button>

                  <Button
                    variant="primary"
                    className="facebook-btn"
                    onClick={handleFacebookSignIn}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faFacebookF} style={{ color: "white", marginRight: '7px', height: '20px', width: '20px' }} />
                    Facebook
                  </Button>
                </div>

                <div className="text-center mt-4">
                  <p>
                    Bạn chưa có tài khoản?{' '}
                    <a href='/register'
                      className="signup-link"
                    >
                      Đăng ký ngay
                    </a>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* You can add your Footer component here */}
      <Footer />
    </div>
  );
}
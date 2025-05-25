import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Eye, EyeOff, Check, X, Facebook } from 'lucide-react';
import '../../css/Register.css';
import { NavbarComponent } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'; // Import the Facebook icon
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';
import axios from 'axios';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [passwordFocus, setPasswordFocus] = useState(false);
  
  const navigate = useNavigate();

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== '';

const handleSubmit = async (e) => {
  e.preventDefault();
  setLocalError(null);

  if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    setLocalError('Please ensure your password meets all requirements.');
    return;
  }

  if (!passwordsMatch) {
    setLocalError('Passwords do not match.');
    return;
  }

  try {
    setLoading(true);
    const payload = {
      name: fullName,
      email,
      password,
    };

    const response = await axios.post(API_ENDPOINTS.REGISTER, payload);

    const { user, token } = response.data;

    localStorage.setItem(NAME_CONFIG.USER, JSON.stringify(user)); 
    localStorage.setItem(NAME_CONFIG.TOKEN, token);

    if (user && token) {
      navigate('/');
    } else {
      setLocalError('Registration failed. Please try again.');
    }
  } catch (err) {
    const msg = err.response?.data?.message || 'Registration error. Please check your input.';
    setLocalError(msg);
  } finally {
    setLoading(false);
  }
};

  const handleGoogleSignIn = () => {
    setLocalError(null);
    setLoading(true);
    // Add Google sign-in logic here
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  const handleFacebookSignIn = () => {
    setLocalError(null);
    setLoading(true);
    // Add Facebook sign-in logic here
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="register-page">
      {/* Add your Navbar component here */}
      <NavbarComponent/>
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="register-card shadow">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="register-title">Tham Gia Re-Home</h2>
                  <p className="register-subtitle">Tạo Tài Khoản Của Bạn Để Tham Gia Re-Home</p>
                </div>

                {localError && (
                  <Alert variant="danger" className="mb-4">
                    {localError}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="fullName">
                    <Form.Label>Nhập Tên Của Bạn</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="email">
                    <Form.Label>Địa chỉ gmail của bạn</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Ví dụ như: khanhdz123@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label>Mật Khẩu Của Bạn</Form.Label>
                    <div className="password-wrapper">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                        required
                      />
                      <Button
                        variant="link"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                    {passwordFocus && (
                      <div className="password-requirements mt-2">
                        <p>Password must have:</p>
                        <div className="requirements-grid">
                          <div className={hasMinLength ? 'valid' : ''}>
                            {hasMinLength ? <Check size={12} /> : <X size={12} />}
                            At least 8 characters
                          </div>
                          <div className={hasUpperCase ? 'valid' : ''}>
                            {hasUpperCase ? <Check size={12} /> : <X size={12} />}
                            One uppercase letter
                          </div>
                          <div className={hasLowerCase ? 'valid' : ''}>
                            {hasLowerCase ? <Check size={12} /> : <X size={12} />}
                            One lowercase letter
                          </div>
                          <div className={hasNumber ? 'valid' : ''}>
                            {hasNumber ? <Check size={12} /> : <X size={12} />}
                            One number
                          </div>
                          <div className={hasSpecialChar ? 'valid' : ''}>
                            {hasSpecialChar ? <Check size={12} /> : <X size={12} />}
                            One special character
                          </div>
                        </div>
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="confirmPassword">
                    <Form.Label>Nhập Lại Mật Khẩu Của Bạn</Form.Label>
                    <div className="password-wrapper">
                      <Form.Control
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <Button
                        variant="link"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                    {confirmPassword && (
                      <div className={`mt-1 ${passwordsMatch ? 'valid' : 'invalid'}`}>
                        {passwordsMatch ? (
                          <>
                            <Check size={12} /> Passwords match
                          </>
                        ) : (
                          <>
                            <X size={12} /> Passwords do not match
                          </>
                        )}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check
                      id="terms"
                      required
                      label={
                        <>
                          Tôi đồng ý với{' '}
                          <a href="#" className="terms-link">Terms of Service</a>
                          {' '}và{' '}
                          <a href="#" className="terms-link">Privacy Policy</a>
                        </>
                      }
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-4 signup-btt"
                    disabled={loading}
                  >
                    {loading ? 'Tạo Tài Khoản...' : 'Tạo Tài Khoản'}
                  </Button>
                </Form>

                <div className="divider">
                  <span>Hoặc đăng nhập với</span>
                </div>

                <div className="social-buttons mt-4">
                  <Button
                    variant="outline-secondary"
                    className="w-100 mb-3 google-btn"
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
                    className="w-100 facebook-btn"
                    onClick={handleFacebookSignIn}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faFacebookF} style={{ color: "white", marginRight: '7px', height: '20px', width: '20px' }} />
                    Facebook
                  </Button>
                </div>

                <div className="text-center mt-4">
                  <p>
                    Đã có tài khoản?{' '}
                    <span
                      className="signin-link"
                      onClick={() => navigate('/Login')}
                    >
                      Đăng Nhập
                    </span>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add your Footer component here */}
      <Footer/>
    </div>
  );
}
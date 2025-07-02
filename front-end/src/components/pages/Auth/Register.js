// front-end/src/components/pages/Auth/Register.js
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
import GoogleLoginButton from './GoogleLoginButton';

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
      setLocalError('Xin vui lòng đảm bảo mật khẩu của bạn đáp ứng tất cả các yêu cầu.');
      return;
    }

    if (!passwordsMatch) {
      setLocalError('Mật khẩu không khớp.');
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
        setLocalError('Đăng ký không thành công. Vui lòng thử lại.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Lỗi đăng ký. Vui lòng kiểm tra thông tin của bạn.';
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
      <NavbarComponent />

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
                        <p>Mật khẩu phải có:</p>
                        <div className="requirements-grid">
                          <div className={hasMinLength ? 'valid' : ''}>
                            {hasMinLength ? <Check size={12} /> : <X size={12} />}
                            Ít nhất 8 ký tự
                          </div>
                          <div className={hasUpperCase ? 'valid' : ''}>
                            {hasUpperCase ? <Check size={12} /> : <X size={12} />}
                            Một ký tự viết hoa
                          </div>
                          <div className={hasLowerCase ? 'valid' : ''}>
                            {hasLowerCase ? <Check size={12} /> : <X size={12} />}
                            Một ký tự viết thường
                          </div>
                          <div className={hasNumber ? 'valid' : ''}>
                            {hasNumber ? <Check size={12} /> : <X size={12} />}
                            Một chữ số
                          </div>
                          <div className={hasSpecialChar ? 'valid' : ''}>
                            {hasSpecialChar ? <Check size={12} /> : <X size={12} />}
                            Một ký tự đặc biệt
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
                            <Check size={12} /> Mật khẩu khớp
                          </>
                        ) : (
                          <>
                            <X size={12} /> Mật khẩu không khớp
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
                          <a href="#" className="terms-link">Điều khoản dịch vụ</a>
                          {' '}và{' '}
                          <a href="#" className="terms-link">Chính sách bảo mật</a>
                          {' '}của Re-Home
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

                  <GoogleLoginButton variant="outline-secondary"
                    className="google-btn" setLoading={setLoading} setError={setLocalError} />

                  {/* <Button
                    variant="primary"
                    className="w-100 facebook-btn"
                    onClick={handleFacebookSignIn}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faFacebookF} style={{ color: "white", marginRight: '7px', height: '20px', width: '20px' }} />
                    Facebook
                  </Button> */}
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
      <Footer />
    </div>
  );
}
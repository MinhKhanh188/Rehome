// front-end/src/components/pages/Auth/Login.js
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';
import '../../css/Login.css'; // We'll create this CSS file
import { Footer } from '../layout/Footer';
import { NavbarComponent } from '../layout/Navbar';
import GoogleLoginButton from './GoogleLoginButton';


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

                  <GoogleLoginButton variant="outline-secondary"
                    className="google-btn" setLoading={setLoading} setError={setLocalError} />

                  {/* <Button
                    variant="primary"
                    className="facebook-btn"
                    onClick={handleFacebookSignIn}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faFacebookF} style={{ color: "white", marginRight: '7px', height: '20px', width: '20px' }} />
                    Facebook
                  </Button> */}
                </div>

                <div className="text-center mt-4">
                  <p>
                    Bạn chưa có tài khoản?{' '}
                    <span
                      className="signup-link"
                      onClick={() => navigate('/register')}
                    >
                      Đăng ký ngay
                    </span>
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
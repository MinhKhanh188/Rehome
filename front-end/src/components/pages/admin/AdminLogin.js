import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';
import { Eye, EyeOff } from 'lucide-react';
import '../../css/Login.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(API_ENDPOINTS.LOGIN, { email, password });
      const { user, token } = response.data;

      if (!user.isAdmin) {
        setLocalError('Tài khoản này không có quyền truy cập trang quản trị.');
        setLoading(false);
        return;
      }

      localStorage.setItem(NAME_CONFIG.USER, JSON.stringify(user));
      localStorage.setItem(NAME_CONFIG.TOKEN, token);
      navigate('/admin');
    } catch (error) {
      setLocalError(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={5}>
            <Card className="login-card p-4 shadow">
              <Card.Body>
                <div className="text-center mb-4">
                  <img src="/images/logo.png" alt="Admin Logo" style={{ height: 48, marginBottom: 8 }} />
                  <h2 className="login-title">Đăng Nhập Quản Trị</h2>
                  <p className="login-subtitle">Chỉ dành cho quản trị viên</p>
                </div>
                {localError && (
                  <Alert variant="danger" className="mb-3">
                    {localError}
                  </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="adminEmail">
                    <Form.Label>Email quản trị</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoFocus
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="adminPassword">
                    <Form.Label>Mật khẩu</Form.Label>
                    <div className="password-wrapper">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        variant="link"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        type="button"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 login-butt"
                    disabled={loading}
                  >
                    {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
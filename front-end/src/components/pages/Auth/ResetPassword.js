// front-end/src/components/pages/Auth/ResetPassword.js
import axios from 'axios';
import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../../../config';
import { Footer } from '../layout/Footer';
import { NavbarComponent } from '../layout/Navbar';

export default function ResetPassword() {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { email } = useParams(); // assuming your route is like /reset-password/:email
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    try {
      const res = await axios.post(API_ENDPOINTS.RESET_PASSWORD, {
        email,
        code,
        newPassword
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setLocalError(err.response?.data?.message || 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <NavbarComponent />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="forgot-password-card shadow">
              <Card.Body className="p-5">
                {success ? (
                  <div className="text-center">
                    <h2 className="forgot-password-title mb-3">Mật khẩu đã được đặt lại</h2>
                    <p className="forgot-password-text mb-4">
                      Bạn đã đặt lại mật khẩu thành công. Bây giờ bạn có thể đăng nhập với mật khẩu mới.
                    </p>
                    <Button
                      variant="primary"
                      className="w-100 return-login-btn"
                      onClick={() => navigate('/login')}
                    >
                      Quay lại đăng nhập
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <h2 className="forgot-password-title">Đặt lại mật khẩu</h2>
                      <p className="forgot-password-subtitle">
                        Nhập mã xác thực và mật khẩu mới của bạn bên dưới
                      </p>
                    </div>

                    <Form onSubmit={handleSubmit}>
                      {localError && (
                        <Alert variant="danger" className="mb-4">
                          {localError}
                        </Alert>
                      )}

                      <Form.Group className="mb-3">
                        <Form.Label>Mã xác thực</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập mã 6 chữ số"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Mật khẩu mới</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Nhập mật khẩu mới"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        className="w-100 send-reset-btt"
                        disabled={loading}
                      >
                        {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                      </Button>
                    </Form>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

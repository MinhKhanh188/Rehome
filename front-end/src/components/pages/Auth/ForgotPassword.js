// front-end/src/components/pages/Auth/ForgotPassword.js
import { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../config';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import '../../css/ForgotPassword.css';
import { NavbarComponent } from '../layout/Navbar';
import { Footer } from '../layout/Footer';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);

    try {
      const res = await axios.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });

      console.log(res.data.message); // optional log
      navigate(`/reset-password/${encodeURIComponent(email)}`);
    } catch (err) {
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
                {submitted ? (
                  <div className="text-center">
                    <CheckCircle className="mx-auto mb-4" size={48} color="#89b96e" />
                    <h2 className="forgot-password-title mb-2">Password reset email sent</h2>
                    <p className="forgot-password-text mb-4">
                      We've sent a password reset link to <span className="email-text">{email}</span>.
                      Please check your inbox and follow the instructions to reset your password.
                    </p>
                    <p className="forgot-password-note mb-4">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                    <div className="d-flex flex-column gap-3">
                      <Button
                        variant="outline-primary"
                        className="w-100 try-different-btn"
                        onClick={() => {
                          setEmail('');
                          setSubmitted(false);
                        }}
                      >
                        Try a different email
                      </Button>
                      <Button
                        variant="primary"
                        className="w-100 return-login-btn"
                        onClick={() => navigate('/login')}
                      >
                        Return to login
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <h2 className="forgot-password-title">Quên Mật Khẩu</h2>
                      <p className="forgot-password-subtitle">
                        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu
                      </p>
                    </div>

                    <Form onSubmit={handleSubmit}>
                      {localError && (
                        <Alert variant="danger" className="mb-4">
                          {localError}
                        </Alert>
                      )}

                      <Form.Group className="mb-4" controlId="email">
                        <Form.Label>Địa chỉ email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Ví dụ: khanhdz123@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 mb-4 send-reset-btt"
                        disabled={loading || !email}
                      >
                        {loading ? 'Sending...' : 'Gửi liên kết đặt lại'}
                      </Button>
                    </Form>

                    <div className="text-center">
                      <Button
                        variant="link"
                        className="back-to-login"
                        onClick={() => navigate('/login')}
                      >
                        <ArrowLeft size={16} className="me-1" />
                        Quay lại đăng nhập
                      </Button>
                    </div>
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
import { useNavigate } from 'react-router-dom';
import { Button, Card, Container } from 'react-bootstrap';
import { Lock } from 'lucide-react';
import '../../css/Login.css'; // Sử dụng lại CSS của login

export default function PleaseLoginFirst() {
  const navigate = useNavigate();

  return (
    <div className="login-page min-vh-100 d-flex flex-column">
      {/* <NavbarComponent /> */}
      <Container className="py-5 flex-grow-1 d-flex align-items-center justify-content-center">
        <Card className="login-card shadow mx-auto" style={{ maxWidth: 450 }}>
          <Card.Body className="p-5 text-center">
            <div className="mb-4">
              <Lock size={48} className="text-warning" />
            </div>
            <h2 className="login-title mb-3">Bạn cần đăng nhập</h2>
            <p className="login-subtitle mb-4">
              Vui lòng đăng nhập để tiếp tục sử dụng chức năng này.
            </p>
            <Button
              variant="warning"
              className="text-white w-100 mb-2 login-butt"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </Button>
            <Button
              variant="outline-secondary"
              className="w-100"
              size="lg"
              onClick={() => navigate('/register')}
            >
              Đăng ký tài khoản mới
            </Button>
          </Card.Body>
        </Card>
      </Container>
      {/* <Footer /> */}
    </div>
  );
}


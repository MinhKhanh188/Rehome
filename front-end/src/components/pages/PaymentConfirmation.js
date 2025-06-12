import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import { CheckCircle } from 'lucide-react';
import { NavbarComponent } from './layout/Navbar';
import { Footer } from './layout/Footer';

export default function PaymentConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderId = params.get('id');

  return (
    <div className="payment-container min-vh-100 d-flex flex-column">
      <NavbarComponent />
      <main className="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
        <Container>
          <Card className="shadow mx-auto text-center" style={{ maxWidth: 500 }}>
            <Card.Body className="py-5">
              <CheckCircle size={64} className="text-success mb-4" />
              <h2 className="mb-3 fw-bold">Thanh toán thành công!</h2>
              <p className="mb-4 text-muted">
                Cảm ơn bạn đã đặt hàng tại Re-Home.<br />
                Đơn hàng của bạn {orderId ? <b>#{orderId}</b> : null} đã được ghi nhận.<br />
                Chúng tôi sẽ liên hệ với bạn để xác nhận và giao hàng sớm nhất.
              </p>
              <Button
                variant="warning"
                className="text-white w-100"
                size="lg"
                onClick={() => navigate('/')}
              >
                Về trang chủ
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
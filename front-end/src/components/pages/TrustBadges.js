// front-end/src/components/pages/layout/ProductCard.js
import { CheckCircle, RotateCcw, Shield, ThumbsUp } from 'lucide-react';
import { Card, Col, Row } from 'react-bootstrap';
import '../css/TrustBadges.css';

export function TrustBadges({ className = '' }) {
  return (
    <div className={`trust-badges ${className}`}>
      <Row xs={2} md={4} className="g-4">
        <Col>
          <Card className="badge-card">
            <Card.Body className="d-flex align-items-center p-3">
              <Shield className="badge-icon shield-icon me-3" />
              <div>
                <Card.Title className="badge-title">Bảo Vệ Người Mua</Card.Title>
                <Card.Text className="badge-text">
                  Hoàn tiền đầy đủ nếu sản phẩm không đúng như mô tả
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="badge-card">
            <Card.Body className="d-flex align-items-center p-3">
              <CheckCircle className="badge-icon check-icon me-3" />
              <div>
                <Card.Title className="badge-title">Người Bán Được Xác Minh</Card.Title>
                <Card.Text className="badge-text">
                  ID và thông tin liên hệ đã được xác minh
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="badge-card">
            <Card.Body className="d-flex align-items-center p-3">
              <RotateCcw className="badge-icon rotate-icon me-3" />
              <div>
                <Card.Title className="badge-title">Đổi Trả Trong 7 Ngày</Card.Title>
                <Card.Text className="badge-text">
                  Chính sách đổi trả trong 7 ngày
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="badge-card">
            <Card.Body className="d-flex align-items-center p-3">
              <ThumbsUp className="badge-icon thumbs-icon me-3" />
              <div>
                <Card.Title className="badge-title">Cam Kết Chất Lượng</Card.Title>
                <Card.Text className="badge-text">
                  Sản phẩm đã được kiểm tra và thử nghiệm
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
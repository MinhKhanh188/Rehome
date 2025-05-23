import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { CheckCircle, Shield, RotateCcw, ThumbsUp } from 'lucide-react';
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
                <Card.Title className="badge-title">Buyer Protection</Card.Title>
                <Card.Text className="badge-text">
                  Full refund if item not as described
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
                <Card.Title className="badge-title">Verified Seller</Card.Title>
                <Card.Text className="badge-text">
                  ID and contact verified
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
                <Card.Title className="badge-title">7-Day Returns</Card.Title>
                <Card.Text className="badge-text">
                  Return policy for peace of mind
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
                <Card.Title className="badge-title">Quality Promise</Card.Title>
                <Card.Text className="badge-text">
                  Inspected and tested products
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
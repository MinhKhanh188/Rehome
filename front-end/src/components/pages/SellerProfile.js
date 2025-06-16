import { Calendar, ChevronRight, MessageSquare, Phone, Shield, Star, ThumbsUp, User } from 'lucide-react';
import { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import '../css/SellerProfile.css';

export function SellerProfile({ sellerName, sellerRating, location, className = '' }) {
  const [showContact, setShowContact] = useState(false);

  // Mock seller data - in a real app would come from an API
  const sellerData = {
    joinDate: 'June 2022',
    responseRate: '98%',
    responseTime: 'Usually within 2 hours',
    totalListings: 24,
    successfulSales: 18,
    positiveRatings: 42,
    verificationBadges: ['Email Verified', 'Phone Verified', 'ID Verified'],
    about: 'I refurbish and sell quality electronics. All products are thoroughly tested and come with a personal guarantee.',
  };

  const handleToggleContact = () => {
    setShowContact(!showContact);
  };

  return (
    <Card className={`seller-profile ${className}`}>
      <Card.Body className="p-4">
        <h2 className="seller-title">Thông Tin Người Bán</h2>

        {/* Seller basic info */}
        <div className="seller-info mb-4">
          <div className="seller-avatar">
            {sellerName?.charAt(0) || 'S'}
          </div>
          <div>
            <h3 className="seller-name">{sellerName}</h3>
            <div className="seller-details">
              <div className="seller-rating">
                <Star className="star-icon" />
                <span>{sellerRating} rating</span>
              </div>
              {location && <span className="seller-location">{location}</span>}
            </div>
          </div>
        </div>

        {/* Verification badges */}
        <div className="verification-badges mb-4">
          {sellerData.verificationBadges.map((badge) => (
            <span key={badge} className="badge">
              <Shield className="badge-icon" />
              {badge}
            </span>
          ))}
        </div>

        {/* Seller stats */}
        <Row className="seller-stats mb-4 g-3">
          <Col xs={6} className="stat-item">
            <Calendar className="stat-icon" />
            <div>
              <div className="stat-label">Tham Gia Từ</div>
              <div className="stat-value">{sellerData.joinDate}</div>
            </div>
          </Col>
          <Col xs={6} className="stat-item">
            <User className="stat-icon" />
            <div>
              <div className="stat-label">Tổng Số Tin Đăng</div>
              <div className="stat-value">{sellerData.totalListings}</div>
            </div>
          </Col>
          {/* <Col xs={6} className="stat-item">
            <MessageSquare className="stat-icon" />
            <div>
              <div className="stat-label">Tỷ Lệ Phản Hồi</div>
              <div className="stat-value">{sellerData.responseRate}</div>
            </div>
          </Col> */}
          {/* <Col xs={6} className="stat-item">
            <ThumbsUp className="stat-icon" />
            <div>
              <div className="stat-label">Đánh Giá Tích Cực</div>
              <div className="stat-value">{sellerData.positiveRatings}</div>
            </div>
          </Col> */}
        </Row>

        {/* About seller */}
        <div className="about-seller mb-4">
          <h4 className="about-title">Giới Thiệu</h4>
          <p className="about-text">{sellerData.about}</p>
        </div>

        {/* Contact section */}
        <div className="contact-section">
          {!showContact ? (
            <Row className="g-3">
              <Col xs={6}>
                <Button className="contact-button w-100" onClick={handleToggleContact}>
                  <MessageSquare size={16} className="me-2" />
                  Nhắn Tin Cho Người Bán
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  variant="outline-secondary"
                  className="contact-button w-100"
                  onClick={handleToggleContact}
                >
                  <Phone size={16} className="me-2" />
                  Hiện Thông Tin Liên Hệ
                </Button>
              </Col>
            </Row>
          ) : (
            <div className="contact-info">
              <h4 className="contact-title">Thông Tin Liên Hệ</h4>
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-content">
                    <Phone className="contact-icon" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <a href="tel:+15551234567" className="contact-link">
                    <Phone size={16} />
                  </a>
                </div>
                <div className="contact-item">
                  <div className="contact-content">
                    <MessageSquare className="contact-icon" />
                    <span>{sellerName.toLowerCase().replace(' ', '')}@email.com</span>
                  </div>
                  <a
                    href={`mailto:${sellerName.toLowerCase().replace(' ', '')}@email.com`}
                    className="contact-link"
                  >
                    <MessageSquare size={16} />
                  </a>
                </div>
              </div>
              <div className="contact-hours">
                Contact hours: 9AM - 6PM local time
              </div>
            </div>
          )}
        </div>

        <div className="view-profile">
          <a href="#" className="profile-link">
            Xem Hồ Sơ Người Bán
            <ChevronRight size={16} className="ms-1" />
          </a>
        </div>
      </Card.Body>
    </Card>
  );
}
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Bell, Lock, User, CreditCard } from 'lucide-react';
import axios from 'axios';
import '../../css/Settings.css';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config'; // Đảm bảo đúng đường dẫn

export default function Settings() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    productUpdates: true,
    marketingEmails: false,
  });

  // Lấy thông tin user khi vào trang
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem(NAME_CONFIG.TOKEN);
        const { data } = await axios.get(API_ENDPOINTS.GET_USER_PROFILE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('User profile data:', data); // Debugging line
        setProfile({
          fullName: data.user.name,
          email: data.user.email || '',
          phone: data.user.phone || '',
          location: data.user.location || '',
        });
      } catch (error) {
        // Xử lý lỗi nếu cần
      }
    };
    fetchProfile();
  }, []);

  return (
    <Container className="settings-container py-5">
      <h1 className="settings-title mb-5">Settings</h1>

      <div className="settings-sections">
        {/* Profile Section */}
        <Card className="settings-card shadow-sm mb-4">
          <Card.Body className="p-4">
            <div className="d-flex align-items-center mb-4">
              <User className="settings-icon me-3" size={20} />
              <h2 className="settings-section-title">Profile Information</h2>
            </div>
            <Row className="g-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.fullName}
                    className="settings-input"
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={profile.email}
                    className="settings-input"
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={profile.phone}
                    className="settings-input"
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.location}
                    className="settings-input"
                    onChange={(e) =>
                      setProfile({ ...profile, location: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Password Section */}
        <Card className="settings-card shadow-sm mb-4">
          <Card.Body className="p-4">
            <div className="d-flex align-items-center mb-4">
              <Lock className="settings-icon me-3" size={20} />
              <h2 className="settings-section-title">Password</h2>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                className="settings-input"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                className="settings-input"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                className="settings-input"
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Payment Methods */}
        <Card className="settings-card shadow-sm mb-4">
          <Card.Body className="p-4">
            <div className="d-flex align-items-center mb-4">
              <CreditCard className="settings-icon me-3" size={20} />
              <h2 className="settings-section-title">Payment Methods</h2>
            </div>
            <div className="payment-method border p-3 rounded mb-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="payment-icon-container me-3">
                    <CreditCard className="payment-icon" size={20} />
                  </div>
                  <div>
                    <p className="payment-card-number mb-0">
                      •••• •••• •••• 4242
                    </p>
                    <p className="payment-expiry">Expires 12/25</p>
                  </div>
                </div>
                <Button
                  variant="link"
                  className="remove-payment text-danger"
                >
                  Remove
                </Button>
              </div>
            </div>
            <Button variant="link" className="add-payment text-orange">
              + Add New Payment Method
            </Button>
          </Card.Body>
        </Card>

        {/* Notifications */}
        <Card className="settings-card shadow-sm mb-4">
          <Card.Body className="p-4">
            <div className="d-flex align-items-center mb-4">
              <Bell className="settings-icon me-3" size={20} />
              <h2 className="settings-section-title">Notifications</h2>
            </div>
            <div className="notification-settings">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <Form.Check
                  key={key}
                  type="checkbox"
                  id={`notification-${key}`}
                  label={key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}
                  checked={value}
                  onChange={(e) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }))
                  }
                  className="notification-checkbox mb-3"
                />
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Action Buttons */}
        <div className="d-flex gap-3">
          <Button variant="primary" className="save-button">
            Save Changes
          </Button>
          <Button variant="outline-secondary" className="cancel-button">
            Cancel
          </Button>
        </div>
      </div>
    </Container>
  );
}
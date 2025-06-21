// front-end/src/components/pages/DashboardLayout.js
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Package, ShoppingCart, Settings, BarChart, MessageCircle, Coins  } from 'lucide-react';
import '../../css/DashboardLayout.css';

const sidebarItems = [
  { icon: Package, label: 'Kho hàng', path: '/dashboard' },
  { icon: MessageCircle, label: 'Tin nhắn', path: '/dashboard/chat' },
  // { icon: ShoppingCart, label: 'Lịch sử mua', path: '/dashboard/purchases' },
  // { icon: BarChart, label: 'Thống kê', path: '/dashboard/analytics' },
  { icon: Coins, label: 'Mua Xu', path: '/dashboard/purchasesCoins' },
  { icon: Settings, label: 'Cài đặt', path: '/dashboard/settings' },
];

export default function DashboardLayout({ children }) {
  const location = useLocation();

  return (
    <div className="dashboard-layout">
      <Row className="g-0">
        {/* Sidebar */}
        <Col xs={12} md={3} lg={2} className="sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Dashboard</h2>
          </div>
          <Nav className="sidebar-nav flex-column">
            {sidebarItems.map(({ icon: Icon, label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `sidebar-link d-flex align-items-center ${isActive ? 'active' : ''}`
                }
                end={path === '/dashboard'} // Ensure exact match for the root path
              >
                <Icon className="sidebar-icon me-3" size={20} />
                <span>{label}</span>
              </NavLink>
            ))}
          </Nav>
        </Col>

        {/* Main Content */}
        <Col xs={12} md={9} lg={10} as="main" className="main-content">
          <Container fluid>
            {children}
          </Container>
        </Col>
      </Row>
    </div>
  );
}
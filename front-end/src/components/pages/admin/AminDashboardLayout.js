// front-end/src/components/pages/admin/AdminDashboard.js
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import {Clock, CheckCircle, Users} from 'lucide-react';
import '../../css/DashboardLayout.css';

const sidebarItems = [
  { icon: Clock, label: 'Chờ Duyệt', path: '/admin' },
  { icon: CheckCircle, label: 'Đã Duyệt', path: '/admin/verified-products' },
  { icon: Users, label: 'Người dùng', path: '/admin/users' },
];


export default function AdminDashboardLayout({ children }) {
  const location = useLocation();

  return (
    <div className="dashboard-layout" style={{
        paddingLeft: '100px',
      }}>
      
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
                end={path === '/admin'} // Ensure exact match for the root path
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
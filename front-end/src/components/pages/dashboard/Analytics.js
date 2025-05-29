// front-end/src/components/pages/Analytics.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { TrendingUp, Users, DollarSign, ShoppingBag } from 'lucide-react';
import '../../css/Analytics.css';

// Placeholder analytics data
const analyticsData = {
  totalSales: 2850,
  totalViews: 1250,
  averagePrice: 450,
  conversionRate: 3.2,
  recentSales: [
    { date: '2024-03-01', amount: 450 },
    { date: '2024-03-02', amount: 600 },
    { date: '2024-03-03', amount: 350 },
    { date: '2024-03-04', amount: 800 },
    { date: '2024-03-05', amount: 650 },
  ],
  popularItems: [
    { title: 'MacBook Pro', views: 450, saves: 32 },
    { title: 'Samsung TV', views: 380, saves: 28 },
    { title: 'Vintage Desk', views: 290, saves: 24 },
  ],
};

// StatCard Component
const StatCard = ({ title, value, icon: Icon, trend }) => (
  <Card className="stat-card shadow-sm p-4">
    <div className="d-flex align-items-center justify-content-between">
      <div>
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
        {trend && (
          <p className={`stat-trend ${trend > 0 ? 'trend-up' : 'trend-down'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
          </p>
        )}
      </div>
      <div className="stat-icon-container">
        <Icon className="stat-icon" size={24} />
      </div>
    </div>
  </Card>
);

export default function Analytics() {
  return (
    <Container className="analytics-container py-5">
      <h1 className="analytics-title mb-5">Analytics</h1>

      <Row className="g-4 mb-5">
        <Col xs={12} md={6} lg={3}>
          <StatCard
            title="Total Sales"
            value={`$${analyticsData.totalSales}`}
            icon={DollarSign}
            trend={12.5}
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard
            title="Total Views"
            value={analyticsData.totalViews.toString()}
            icon={Users}
            trend={8.2}
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard
            title="Average Price"
            value={`$${analyticsData.averagePrice}`}
            icon={TrendingUp}
            trend={-2.4}
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard
            title="Conversion Rate"
            value={`${analyticsData.conversionRate}%`}
            icon={ShoppingBag}
            trend={1.8}
          />
        </Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} lg={6}>
          <Card className="analytics-card shadow-sm p-4">
            <Card.Title className="analytics-section-title mb-4">Recent Sales</Card.Title>
            <div className="analytics-list">
              {analyticsData.recentSales.map((sale, index) => (
                <div key={index} className="analytics-item d-flex justify-content-between align-items-center">
                  <span className="item-date">
                    {new Date(sale.date).toLocaleDateString()}
                  </span>
                  <span className="item-amount">${sale.amount}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="analytics-card shadow-sm p-4">
            <Card.Title className="analytics-section-title mb-4">Popular Items</Card.Title>
            <div className="analytics-list">
              {analyticsData.popularItems.map((item, index) => (
                <div key={index} className="analytics-item d-flex justify-content-between align-items-center">
                  <span className="item-title">{item.title}</span>
                  <div className="item-stats">
                    <span className="item-views">{item.views} views</span>
                    <span className="mx-2">•</span>
                    <span className="item-saves">{item.saves} saves</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
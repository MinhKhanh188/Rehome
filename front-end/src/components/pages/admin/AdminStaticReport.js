// front-end/src/components/pages/admin/AdminStaticReport.js
import React from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell, Legend
} from "recharts";
import { Row, Col, Card } from "react-bootstrap";

// Mock data
const userData = [
  { role: "Buyer", count: 230 },
  { role: "Seller", count: 120 },
  { role: "Admin", count: 3 },
];

const revenueByDay = [
  { date: "2025-07-01", revenue: 300 },
  { date: "2025-07-02", revenue: 600 },
  { date: "2025-07-03", revenue: 150 },
  { date: "2025-07-04", revenue: 500 },
  { date: "2025-07-05", revenue: 900 },
];

const postStatus = [
  { status: "Active", count: 80 },
  { status: "Sold", count: 120 },
];

const bestSellingCategories = [
  { category: "Electronics", sold: 40 },
  { category: "Furniture", sold: 25 },
  { category: "Books", sold: 18 },
  { category: "Clothing", sold: 12 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1"];

export default function AnalyticsDashboard() {
  return (
    <div className="p-4">
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>👥 Current Users</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={userData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>💰 Revenue by Day</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>📦 Posts Status</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={postStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {postStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>🏆 Best-Selling Categories</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={bestSellingCategories} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" />
                  <Tooltip />
                  <Bar dataKey="sold" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

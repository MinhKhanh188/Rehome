// front-end/src/components/pages/admin/AdminStaticReport.js
import React, { useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell, Legend
} from "recharts";
import { Row, Col, Card } from "react-bootstrap";
import { API_ENDPOINTS, NAME_CONFIG } from "../../../config";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1"];

const CustomYAxisTick = ({ x, y, payload }) => {
  const text = payload.value;
  const maxLength = 25;
  const displayText = text.length > maxLength ? text.slice(0, maxLength) + "…" : text;

  return (
    <text x={x - 5} y={y + 5} textAnchor="end" fontSize={12}>
      {displayText}
    </text>
  );
};

export default function AnalyticsDashboard() {
  const [userStats, setUserStats] = React.useState([]);
  const [revenueStats, setRevenueStats] = React.useState([]);
  const [postStatusStats, setPostStatusStats] = React.useState([]);
  const [bestSellingCategories, setBestSellingCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const token = localStorage.getItem(NAME_CONFIG.TOKEN);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [userRes, revenueRes, postRes, categoryRes] = await Promise.all([
          fetch(API_ENDPOINTS.GET_USER_STATS, { headers }),
          fetch(API_ENDPOINTS.GET_REVENUE_BY_DAY, { headers }),
          fetch(API_ENDPOINTS.GET_POST_STATUS, { headers }),
          fetch(API_ENDPOINTS.GET_BEST_SELLING_CATEGORIES, { headers }),
        ]);

        const userData = await userRes.json();
        const revenueData = await revenueRes.json();
        const postData = await postRes.json();
        const categoryData = await categoryRes.json();

        setUserStats(userData);
        setRevenueStats(revenueData); // must contain totalRevenue & dailyRevenue
        setPostStatusStats(postData);
        setBestSellingCategories(categoryData);
      } catch (err) {
        console.error("Error fetching static report data:", err);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (userStats.length && revenueStats.length && postStatusStats.length && bestSellingCategories.length) {
      setLoading(false);
    }
  }, [userStats, revenueStats, postStatusStats, bestSellingCategories]);

  return (
    <div className="p-4">
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>👥 Người dùng hiện tại</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={userStats}>
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
            <Card.Header>💰 Doanh thu</Card.Header>
            <Card.Body>
              <h5 className="mb-3">
                Tổng doanh thu: {revenueStats.totalRevenue?.toLocaleString("vi-VN")} đ
              </h5>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueStats.dailyRevenue}>
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
            <Card.Header>📦 Trạng thái bài đăng</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={postStatusStats}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {postStatusStats.map((entry, index) => (
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
            <Card.Header>🏆 Danh mục bán chạy nhất</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={bestSellingCategories}
                  layout="vertical"
                  margin={{ left: 100, right: 30, top: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" tick={<CustomYAxisTick />} />
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

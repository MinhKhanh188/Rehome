import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Tabs, Tab, Badge } from 'react-bootstrap';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../config';
import '../../css/AdminDashboard.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState('users');

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.ADMIN_USERS);
      setUsers(res.data);
    } catch (err) {
      setUsers([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.ADMIN_PRODUCTS);
      setProducts(res.data);
    } catch (err) {
      setProducts([]);
    }
  };

  const handleVerifyProduct = async (productId) => {
    await axios.put(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${productId}/verify`);
    fetchProducts();
  };

  const handleBanUser = async (userId) => {
    await axios.put(`${API_ENDPOINTS.ADMIN_USERS}/${userId}/ban`);
    fetchUsers();
  };

  return (
    <Container className="admin-dashboard-container py-5">
      <h1 className="admin-dashboard-title">Admin Dashboard</h1>
      <Tabs activeKey={tab} onSelect={setTab} className="mb-4 admin-tabs">
        <Tab eventKey="users" title="Quản lý người dùng">
          <Table striped bordered hover className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Tên</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.email}</td>
                  <td>{u.fullName}</td>
                  <td>
                    {u.banned ? <Badge bg="danger">Banned</Badge> : <Badge bg="success">Active</Badge>}
                  </td>
                  <td>
                    {!u.banned && (
                      <Button size="sm" variant="danger" onClick={() => handleBanUser(u._id)}>
                        Ban
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="products" title="Kiểm duyệt sản phẩm">
          <Table striped bordered hover className="admin-table">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Người đăng</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.owner?.email || 'N/A'}</td>
                  <td>
                    {p.verified ? <Badge bg="success">Đã duyệt</Badge> : <Badge bg="warning">Chờ duyệt</Badge>}
                  </td>
                  <td>
                    {!p.verified && (
                      <Button size="sm" variant="primary" onClick={() => handleVerifyProduct(p._id)}>
                        Duyệt
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </Container>
  );
}
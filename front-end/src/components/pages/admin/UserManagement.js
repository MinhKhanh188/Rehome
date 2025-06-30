// front-end/src/components/pages/admin/UserManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';
import { Badge, Button, Table } from 'react-bootstrap';
import '../../css/AdminDashboard.css'; // Import your custom CSS for styling

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem(NAME_CONFIG.TOKEN);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Replace with your actual user list endpoint
        const { data } = await axios.get(`${API_ENDPOINTS.GET_ALL_USERS || '/api/users'}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(data.users || data); // Adjust based on API response shape
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();
  }, [token]);
  const handleBanUser = async (userId) => {
    await axios.put(`${API_ENDPOINTS.ADMIN_USERS}/${userId}/ban`);
    setUsers(users.map(user => 
      user._id === userId ? { ...user, banned: true } : user
    ));
  };

  return (
    <div className="container mt-4">
      
      <Table striped bordered hover className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Tên</th>
                <th>Unique Id</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.email}</td>
                  <td>{u.name}</td>
                  <td>{u.uniqueId}</td>
                  <td>
                    {u.isVerified ? <Badge bg="danger">Banned</Badge> : <Badge bg="success">Đã kích hoạt</Badge>}
                  </td>
                  <td>
                    
                    {!u.isVerified && (
                      <Button size="sm" variant="danger" onClick={() => handleBanUser(u._id)}>
                        Ban
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
    </div>
  );
}

// front-end/src/components/pages/admin/UserManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem(NAME_CONFIG.TOKEN);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Replace with your actual user list endpoint
        const { data } = await axios.get(`${API_ENDPOINTS.GET_USERS || '/api/users'}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(data.users || data); // Adjust based on API response shape
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <div className="container mt-4">
      <h2>Quản lý người dùng</h2>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">Không có người dùng</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role || 'User'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

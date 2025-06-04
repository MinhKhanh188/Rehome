// front-end/src/components/pages/admin/VerifiedProducts.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';

export default function VerifiedProducts() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [provinces, setProvinces] = useState([]);
  const token = localStorage.getItem(NAME_CONFIG.TOKEN);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { data } = await axios.get(API_ENDPOINTS.GET_ALL_PROVINCE);
        setProvinces(data);
      } catch (err) {
        console.error('Failed to fetch provinces', err);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchVerifiedPosts = async () => {
      try {
        const params = new URLSearchParams({
          page: currentPage,
          name: searchName,
          province: provinceFilter
        });
        const { data } = await axios.get(`${API_ENDPOINTS.GET_VERIFIED_POSTS}?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching verified posts', error);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchVerifiedPosts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchName, provinceFilter, token]);

  return (
    <div className="container mt-4">
      <h2>Sản phẩm đã duyệt</h2>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Người bán</th>
            <th>Tỉnh</th>
            <th>Ngày đăng</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr><td colSpan="5" className="text-center">Không có sản phẩm</td></tr>
          ) : (
            posts.map(post => (
              <tr key={post._id}>
                <td><img src={post.images[0]} alt={post.name} width="80" /></td>
                <td>{post.name}</td>
                <td>{post.sellerId?.name}</td>
                <td>{post.province?.name}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-outline-primary me-2"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Trước
        </button>
        <span className="align-self-center">Trang {currentPage} / {totalPages}</span>
        <button
          className="btn btn-outline-primary ms-2"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Tiếp
        </button>
      </div>
    </div>
  );
}

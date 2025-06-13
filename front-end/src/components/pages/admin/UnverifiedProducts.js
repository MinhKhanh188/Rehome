// front-end/src/components/pages/admin/UnverifiedProducts.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';
import { Table, Button, Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '../../css/AdminDashboard.css';
import PostDetailModal from './modal/PostDetailModal';

export default function UnverifiedProducts() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [modalShow, setModalShow] = useState(false);

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
    const fetchUnverifiedPosts = async () => {
      try {
        const params = new URLSearchParams({
          page: currentPage,
          name: searchName,
          province: provinceFilter
        });
        const { data } = await axios.get(`${API_ENDPOINTS.GET_UNVERIFIED_POSTS}?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching unverified posts', error);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchUnverifiedPosts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchName, provinceFilter, token]);

  // Verify post handler
  const handleVerify = async (postId) => {
    try {
      await axios.put(`${API_ENDPOINTS.VERIFY_POST}/${postId}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(posts.filter(post => post._id !== postId));
      Swal.fire({
        icon: 'success',
        title: 'Duyệt sản phẩm thành công',
        text: 'Sản phẩm đã được duyệt thành công.',
      });
    } catch (error) {
      console.error('Failed to verify post', error);
      alert('Không thể duyệt sản phẩm. Thử lại nhé.');
    }
  };

  const handleViewDetail = (postId) => {
    setSelectedPostId(postId);
    setModalShow(true);
  };


  return (
    <>
      <div className="container mt-4">
        <Table striped bordered hover className="admin-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Người bán</th>
              <th>Tỉnh</th>
              <th>Ngày đăng</th>
              <th>Duyệt</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">Không có sản phẩm</td>
              </tr>
            ) : (
              posts.map(post => (
                <tr key={post._id}>
                  <td>
                    <img src={post.images[0]} alt={post.name} width="80" style={{ borderRadius: 8 }} />
                  </td>
                  <td>{post.name}</td>
                  <td>{post.sellerId?.name}</td>
                  <td>
                    <Badge bg="secondary">{post.province?.name || post.province}</Badge>
                  </td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        className="btn-sm"
                        variant="info"
                        onClick={() => handleViewDetail(post._id)}
                      >
                        Xem
                      </Button>
                      <Button
                        className="btn-sm"
                        variant="warning"
                        onClick={() => handleVerify(post._id)}
                      >
                        Duyệt
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <div className="d-flex justify-content-center mt-3">
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Trước
          </Button>
          <span className="align-self-center">Trang {currentPage} / {totalPages}</span>
          <Button
            variant="outline-primary"
            className="ms-2"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Tiếp
          </Button>
        </div>
      </div>

      <PostDetailModal
        show={modalShow}
        handleClose={() => setModalShow(false)}
        postId={selectedPostId}
      />
    </>
  );

}

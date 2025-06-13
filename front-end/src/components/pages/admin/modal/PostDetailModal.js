// front-end/src/components/pages/admin/modal/PostDetailModal.js  
import React, { useEffect, useState } from 'react';
import { Modal, Button, Image, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../../config';

export default function PostDetailModal({ show, handleClose, postId }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (show && postId) {
      const token = localStorage.getItem(NAME_CONFIG.TOKEN);
      setLoading(true);
      axios.get(`${API_ENDPOINTS.ADMIN_GET_POST_DETAIL}/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => setPost(res.data))
        .catch(err => console.error('Failed to fetch post detail:', err))
        .finally(() => setLoading(false));
    }
  }, [show, postId]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết sản phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" /></div>
        ) : post ? (
          <>
            <h4>{post.name}</h4>
            <p><strong>Người bán:</strong> {post.seller?.name}</p>
            <p><strong>Giá:</strong> {post.price.toLocaleString()} VND</p>
            <p><strong>Giá gốc:</strong> {post.originalPrice?.toLocaleString()} VND</p>
            <p><strong>Tình trạng:</strong> {post.productStatus}</p>
            <p><strong>Địa chỉ:</strong> {post.address}</p>
            <p><strong>Tỉnh:</strong> {post.province}</p>
            <p><strong>Mô tả:</strong> {post.description}</p>
            <Row className="g-2">
              {post.images.map((url, index) => (
                <Col xs={6} md={4} key={index}>
                  <Image src={url} alt={`post-img-${index}`} fluid rounded />
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <p>Không tìm thấy thông tin bài đăng.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
}

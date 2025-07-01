// front-end/src/components/pages/dashboard/modal/ChangeStatusModal.js
import axios from 'axios';
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../../config';

export default function ChangeStatusModal({ show, onHide, postId, onStatusUpdated }) {
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem(NAME_CONFIG.TOKEN);
    if (!token) return;

    try {
      const res = await axios.put(
        API_ENDPOINTS.CHANGE_POST_STATUS(postId),
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Status updated:', res.data);
      if (onStatusUpdated) onStatusUpdated(postId, status);
      onHide();
    } catch (error) {
      console.error('Failed to change post status:', error);
      alert('Không thể thay đổi trạng thái bài đăng 💔');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thay đổi trạng thái bài đăng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Trạng thái mới</Form.Label>
          <Form.Select value={status} onChange={handleChange}>
            <option value="">-- Chọn trạng thái --</option>
            <option value="available">Đang bán</option>
            <option value="sold">Đã bán</option>
            <option value="hidden">Ẩn</option>
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!status}>
          Lưu thay đổi
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

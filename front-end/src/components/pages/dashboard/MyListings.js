// front-end/src/components/pages/dashboard/MyListings.js
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Plus } from 'lucide-react';
import ProductListingCard from './ProductListingCard';
import '../../css/MyListings.css';
import ChangeStatusModal from './modal/ChangeStatusModal';



export default function MyListings() {
  const [myListings, setMyListings] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const openStatusModal = (id) => {
    setSelectedPostId(id);
    setShowModal(true);
  };

  const handleStatusUpdated = (postId, newStatus) => {
    setMyListings((prev) =>
      prev.map((post) =>
        post._id === postId ? { ...post, status: newStatus } : post
      )
    );
  };



  useEffect(() => {
    const token = localStorage.getItem(NAME_CONFIG.TOKEN);

    if (!token) return;

    axios.get(API_ENDPOINTS.GET_USER_POSTS, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        setMyListings(res.data); // assumes data is the array
      })
      .catch((err) => {
        console.error('Failed to fetch personal posts:', err);
      });
  }, []);



  const handleEdit = (id) => {
    navigate(`/dashboard/edit/${id}`);
  };

  const handleArchive = (id) => {
    console.log('Archive product:', id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem(NAME_CONFIG.TOKEN);
    if (!token) return;

    if (!window.confirm('Bạn có chắc chắn sẽ xóa bài đăng này không?, Một khi xóa sẽ không thể khôi phục')) {
      return;
    }

    try {
      await axios.delete(API_ENDPOINTS.DELETE_MY_POST(id), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Remove the deleted post from state
      setMyListings((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Có lỗi xảy ra khi xóa bài đăng.');
    }
  };
  ;

  // Filter listings based on status
  const filteredListings = myListings.filter((product) => {
    if (filter === 'all') return true;
    return product.status === filter;
  });

  return (
    <>
      <Container className="my-listings py-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="listings-title">Danh sách</h1>
          <Button
            variant="primary"
            className="add-list-btn1 d-flex align-items-center"
            onClick={() => navigate('/dashboard/new-listing')}
          >
            <Plus className="me-2" size={20} />
            Đăng bán sản phẩm
          </Button>
        </div>

        <div className="d-flex align-items-center mb-4">
          <Form.Group className="filter-group position-relative">
            {/* <Filter className="filter-icon" size={20} /> */}
            <Form.Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất Cả</option>
              <option value="active">Đang Bày Bán</option>
              <option value="sold">Đã Bán</option>
              {/* <option value="archived">Lưu Trữ</option> */}
            </Form.Select>
          </Form.Group>
        </div>

        <Row className="g-4">
          {filteredListings.length === 0 ? (
            <Col>
              <div className="no-listings text-center p-5">
                <p>No listings found for the selected filter.</p>
              </div>
            </Col>
          ) : (
            filteredListings.map((product) => (
              <Col md={6} lg={4} key={product.id}>
                <ProductListingCard
                  key={product._id}
                  product={product}
                  onEdit={handleEdit}                 // open edit page
                  onChangeStatus={() => openStatusModal(product._id)} // open modal
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                />

              </Col>
            ))
          )}
        </Row>
      </Container>
      <ChangeStatusModal
        show={showModal}
        onHide={() => setShowModal(false)}
        postId={selectedPostId}
        onStatusUpdated={handleStatusUpdated}
      />

    </>
  );
}
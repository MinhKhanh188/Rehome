// front-end/src/components/pages/dashboard/ProductListingCard.js
import React, { useState } from 'react';
import { Card, Dropdown, Button, Badge } from 'react-bootstrap';
import { MoreVertical, Eye, Heart, Edit, Archive, Trash } from 'lucide-react';
import '../../css/ProductListingCard.css';

const ProductListingCard = ({
  product: propProduct,
  stats: propStats = {},
  onEdit,
  onArchive,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const {
    _id,
    name,
    images = [],
    status,
    is_vip,
    price,
    categoryId,
    productStatus,
    createdAt
  } = propProduct;

  return (
    <Card className="listing-card shadow-sm">
      <div className="listing-image-container">
        <Card.Img
          variant="top"
          src={images[0] || 'https://via.placeholder.com/150'}
          alt={name}
          className="listing-image"
        />
        <Badge
          className={`status-badge ${status === 'sold'
            ? 'sold'
            : status === 'archived'
              ? 'archived'
              : status === 'pending'
                ? 'pending'
                : is_vip
                  ? 'vip'
                  : 'active'
            }`}
        >
          {status === 'sold'
            ? 'Đã bán'
            : status === 'archived'
              ? 'Đã lưu trữ'
              : status === 'pending'
                ? 'Đang chờ duyệt'
                : is_vip
                  ? 'VIP'
                  : 'Đang bày bán'}
        </Badge>

      </div>

      <Card.Body className="menu p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="listing-title">{name}</Card.Title>
          <Dropdown onToggle={() => setShowMenu(!showMenu)} show={showMenu}>
            <Dropdown.Toggle
              as={Button}
              variant="link"
              className="menu-toggle p-1"
            >
              <MoreVertical size={20} className="text-gray-500" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="listing-menu">
              <Dropdown.Item
                onClick={() => onEdit(_id)}
                className="d-flex align-items-center"
              >
                <Edit size={16} className="me-2" />
                Chỉnh sửa
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => onArchive(_id)}
                className="d-flex align-items-center"
              >
                <Archive size={16} className="me-2" />
                Lưu trữ
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => onDelete(_id)}
                className="d-flex align-items-center text-danger"
              >
                <Trash size={16} className="me-2" />
                Xoá
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Card.Text className="listing-category">
          {categoryId?.name || 'Không rõ danh mục'}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="listing-price">{price.toLocaleString()}₫</span>
          <Badge className="listing-condition">{productStatus}</Badge>
        </div>

        <div className="listing-stats pt-3 border-top">
          <div className="d-flex justify-content-between align-items-center">
            {/* <div className="d-flex align-items-center">
              <Eye size={16} className="me-1 text-gray-500" />
              <span>{propStats.total_views || 0}</span>
            </div> */}
            {/* <div className="d-flex align-items-center">
              <Heart size={16} className="me-1 text-gray-500" />
              <span>{propStats.saved_count || 0}</span>
            </div> */}
            <div className="listing-date">
              Đăng ngày {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};


export default ProductListingCard;
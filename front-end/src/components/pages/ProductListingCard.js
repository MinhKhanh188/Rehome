import React, { useState } from 'react';
import { Card, Dropdown, Button, Badge } from 'react-bootstrap';
import { MoreVertical, Eye, Heart, Edit, Archive, Trash } from 'lucide-react';
import '../css/ProductListingCard.css';

// Placeholder data structure (replace with actual data source)
const product = {
  id: '1',
  title: 'MacBook Pro 2023',
  description: 'Excellent condition, barely used',
  price: 1499,
  category: 'Electronics',
  condition: 'Like New',
  images: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  ],
  created_at: '2024-03-01T10:00:00Z',
  is_vip: true,
  status: 'active',
};

const stats = {
  total_views: 245,
  saved_count: 12,
  last_viewed: '2024-03-10T14:30:00Z',
};

const ProductListingCard = ({ product: propProduct = product, stats: propStats = stats, onEdit, onArchive, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Card className="listing-card shadow-sm">
      <div className="listing-image-container">
        <Card.Img
          variant="top"
          src={propProduct.images[0] || 'https://via.placeholder.com/150'}
          alt={propProduct.title}
          className="listing-image"
        />
        <Badge
          className={`status-badge ${
            propProduct.status === 'sold'
              ? 'sold'
              : propProduct.status === 'archived'
              ? 'archived'
              : propProduct.is_vip
              ? 'vip'
              : 'active'
          }`}
        >
          {propProduct.status === 'sold'
            ? 'Sold'
            : propProduct.status === 'archived'
            ? 'Archived'
            : propProduct.is_vip
            ? 'VIP'
            : 'Active'}
        </Badge>
      </div>

      <Card.Body className="menu p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="listing-title">{propProduct.title}</Card.Title>
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
                onClick={() => onEdit(propProduct.id)}
                className="d-flex align-items-center"
              >
                <Edit size={16} className="me-2" />
                Edit Listing
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => onArchive(propProduct.id)}
                className="d-flex align-items-center"
              >
                <Archive size={16} className="me-2" />
                Archive
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => onDelete(propProduct.id)}
                className="d-flex align-items-center text-danger"
              >
                <Trash size={16} className="me-2" />
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Card.Text className="listing-category">{propProduct.category}</Card.Text>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="listing-price">${propProduct.price.toLocaleString()}</span>
          <Badge className="listing-condition">{propProduct.condition}</Badge>
        </div>

        <div className="listing-stats pt-3 border-top">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Eye size={16} className="me-1 text-gray-500" />
              <span>{propStats.total_views}</span>
            </div>
            <div className="d-flex align-items-center">
              <Heart size={16} className="me-1 text-gray-500" />
              <span>{propStats.saved_count}</span>
            </div>
            <div className="listing-date">
              Listed {new Date(propProduct.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductListingCard;
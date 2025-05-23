import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Plus, Filter } from 'lucide-react';
import ProductListingCard from './ProductListingCard';
import '../css/MyListings.css';

// Placeholder data (replace with actual data source)
const MY_LISTINGS = [
  {
    id: '1',
    title: 'MacBook Pro 2023',
    description: 'Excellent condition, barely used',
    price: 1499,
    category: 'Electronics',
    condition: 'Like New',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'],
    seller_id: 'user1',
    created_at: '2024-03-01T10:00:00Z',
    is_vip: true,
    status: 'active',
  },
  {
    id: '2',
    title: 'Modern Sofa',
    description: 'Comfortable 3-seater sofa',
    price: 599,
    category: 'Furniture',
    condition: 'Good',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'],
    seller_id: 'user1',
    created_at: '2024-02-28T15:30:00Z',
    is_vip: false,
    status: 'sold',
  },
];

const PRODUCT_STATS = {
  '1': { total_views: 245, saved_count: 12, last_viewed: '2024-03-10T14:30:00Z' },
  '2': { total_views: 180, saved_count: 8, last_viewed: '2024-03-09T11:20:00Z' },
};

export default function MyListings() {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/dashboard/edit/${id}`);
  };

  const handleArchive = (id) => {
    console.log('Archive product:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete product:', id);
  };

  // Filter listings based on status
  const filteredListings = MY_LISTINGS.filter((product) => {
    if (filter === 'all') return true;
    return product.status === filter;
  });

  return (
    <Container className="my-listings py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="listings-title">My Listings</h1>
        <Button
          variant="primary"
          className="add-list-btn1 d-flex align-items-center"
          onClick={() => navigate('/dashboard/new-listing')}
        >
          <Plus className="me-2" size={20} />
          New Listing
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
            <option value="all">All Listings</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="archived">Archived</option>
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
                product={product}
                stats={PRODUCT_STATS[product.id]}
                onEdit={handleEdit}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}
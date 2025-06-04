import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { Star } from 'lucide-react';
import '../css/RelatedProducts.css';

// Nếu không dùng TypeScript, bạn có thể bỏ phần interface Product

// Mock product data
const products = [
  {
    id: 1,
    name: 'iPhone 13 Pro 256GB - Graphite',
    price: 799.99,
    condition: 'Like New',
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1630691711598-5c9f4f37f4e6',
      'https://images.unsplash.com/photo-1642053551054-8d60215e1518'
    ],
    isVip: true,
    createdAt: '2024-05-01T10:00:00Z',
    sellerRating: 4.8,
    sellerName: 'John Doe',
    listedDate: '2 days ago',
    location: 'New York, NY',
    description: 'Like-new iPhone 13 Pro in Graphite. Fully functional with no scratches or dents. Comes with original box and charger.',
    specifications: {
      Storage: '256GB',
      'Screen Size': '6.1 inches',
      Processor: 'A15 Bionic',
      Battery: '3095 mAh',
    },
    originalPrice: 999.99,
    additionalImages: [
      'https://images.unsplash.com/photo-1642053551054-8d60215e1518'
    ]
  },
  {
    id: 2,
    name: 'Samsung Galaxy S22 Ultra',
    price: 699.99,
    condition: 'Excellent',
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1642053551054-8d60215e1518'
    ],
    isVip: false,
    createdAt: '2024-05-10T12:00:00Z',
    sellerRating: 4.7,
    sellerName: 'Jane Smith',
    listedDate: '1 week ago',
    location: 'Los Angeles, CA',
    description: 'Excellent condition Galaxy S22 Ultra. Minor signs of use, fully functional with charger included.',
    specifications: {
      Storage: '128GB',
      'Screen Size': '6.8 inches',
      Processor: 'Snapdragon 8 Gen 1',
    },
    additionalImages: []
  },
  {
    id: 3,
    name: 'Modern Sofa',
    price: 350,
    condition: 'Good',
    category: 'furniture',
    images: [
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4'
    ],
    isVip: false,
    createdAt: '2024-05-15T09:00:00Z',
    sellerRating: 4.5,
    sellerName: 'Sofa Store',
    listedDate: '5 days ago',
    location: 'Chicago, IL',
    description: 'Comfortable modern sofa, gently used, no stains or tears.',
    specifications: {
      Material: 'Fabric',
      Color: 'Gray',
      Size: '3-seater',
    },
    additionalImages: []
  },
  {
    id: 4,
    name: 'Hoang Kong Style Sofa',
    price: 350,
    condition: 'Good',
    category: 'furniture',
    images: [
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2'
    ],
    isVip: false,
    createdAt: '2024-05-15T09:00:00Z',
    sellerRating: 4.5,
    sellerName: 'Sofa Store',
    listedDate: '5 days ago',
    location: 'Chicago, IL',
    description: 'Comfortable modern sofa, gently used, no stains or tears.',
    specifications: {
      Material: 'Fabric',
      Color: 'Gray',
      Size: '3-seater',
    },
    additionalImages: []
  },
  {
    id: 5,
    name: 'Huong Kong Style Sofa',
    price: 500,
    condition: 'Good',
    category: 'furniture',
    images: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
    ],
    isVip: false,
    createdAt: '2024-05-15T09:00:00Z',
    sellerRating: 4.5,
    sellerName: 'Sofa Store',
    listedDate: '5 days ago',
    location: 'Chicago, IL',
    description: 'Comfortable modern sofa, gently used, no stains or tears.',
    specifications: {
      Material: 'Fabric',
      Color: 'Gray',
      Size: '3-seater',
    },
    additionalImages: []
  }
];

export function RelatedProducts({ currentProductId, currentCategory, className = '' }) {
  const navigate = useNavigate();

  // Lọc sản phẩm liên quan
  const relatedProducts = products
    .filter((product) => product.id !== currentProductId && product.category === currentCategory)
    .slice(0, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <div className={`related-products ${className}`}>
      <h2 className="section-title">Sản Phẩm Liên Quan</h2>
      <Row xs={1} sm={2} md={4} className="g-4">
        {relatedProducts.map((product) => (
          <Col key={product.id}>
            <Card
              className="product-card"
              onClick={() => navigate(`/products/product-details/?id=${product.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="image-container">
                <Card.Img
                  variant="top"
                  src={product.images}
                  alt={product.title}
                  className="product-image"
                />
                <Badge className="condition-badge">{product.condition}</Badge>
              </div>
              <Card.Body className="p-3">
                <Card.Title className="product-title">{product.name}</Card.Title>
                <div className="product-details">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <div className="seller-rating">
                    <Star className="star-icon" />
                    <span>{product.sellerRating}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
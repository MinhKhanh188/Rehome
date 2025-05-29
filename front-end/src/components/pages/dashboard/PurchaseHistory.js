import React from 'react';
import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
import { Package, Truck, CheckCircle } from 'lucide-react';
import '../../css/PurchaseHistory.css';

// Placeholder purchase data
const purchases = [
  {
    id: '1',
    product: {
      title: 'Sony PlayStation 5',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      price: 450,
    },
    status: 'delivered',
    date: '2024-03-01T10:00:00Z',
    seller: 'John Doe',
  },
  {
    id: '2',
    product: {
      title: 'LG 4K Smart TV',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      price: 699,
    },
    status: 'in_transit',
    date: '2024-03-05T15:30:00Z',
    seller: 'Jane Smith',
  },
  {
    id: '3',
    product: {
      title: 'Vintage Coffee Table',
      image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      price: 150,
    },
    status: 'processing',
    date: '2024-03-08T09:15:00Z',
    seller: 'Mike Johnson',
  },
];

// StatusBadge Component
const StatusBadge = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'processing':
        return {
          icon: Package,
          text: 'Processing',
          bg: 'bg-blue',
          textColor: 'text-blue',
        };
      case 'in_transit':
        return {
          icon: Truck,
          text: 'In Transit',
          bg: 'bg-yellow',
          textColor: 'text-yellow',
        };
      case 'delivered':
        return {
          icon: CheckCircle,
          text: 'Delivered',
          bg: 'bg-green',
          textColor: 'text-green',
        };
      default:
        return {
          icon: Package,
          text: 'Unknown',
          bg: 'bg-gray',
          textColor: 'text-gray',
        };
    }
  };

  const { icon: Icon, text, bg, textColor } = getStatusInfo();

  return (
    <Badge className={`status-badge ${bg} ${textColor}`}>
      <Icon size={16} className="me-1" />
      <span>{text}</span>
    </Badge>
  );
};

export default function PurchaseHistory() {
  return (
    <Container className="purchase-history py-5">
      <h1 className="history-title mb-5">Purchase History</h1>

      <div className="purchase-list">
        {purchases.map((purchase) => (
          <Card key={purchase.id} className="purchase-card shadow-sm mb-4">
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col xs={12} md={3} lg={2} className="mb-3 mb-md-0">
                  <div className="purchase-image-container">
                    <img
                      src={purchase.product.image}
                      alt={purchase.product.title}
                      className="purchase-image"
                    />
                  </div>
                </Col>
                <Col xs={12} md={6} lg={7}>
                  <h3 className="purchase-title">{purchase.product.title}</h3>
                  <p className="purchase-seller">Seller: {purchase.seller}</p>
                  <p className="purchase-price">
                    ${purchase.product.price.toLocaleString()}
                  </p>
                </Col>
                <Col xs={12} md={3} className="text-md-end">
                  <StatusBadge status={purchase.status} />
                  <p className="purchase-date mt-2">
                    {new Date(purchase.date).toLocaleDateString()}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
}
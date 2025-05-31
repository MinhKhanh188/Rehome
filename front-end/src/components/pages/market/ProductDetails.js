// front-end/src/components/pages/market/ProductDetails.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge, Spinner } from 'react-bootstrap';
import {
  Star,
  Clock,
  Heart,
  ArrowLeft,
  Shield,
  MapPin,
  Calendar,
} from 'lucide-react';
import { NavbarComponent } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { ImageGallery } from '../ImageGallery';
import { ConditionExplainer } from '../ConditionExplainer';
import { ProductSpecifications } from '../ProductSpecifications';
import { SellerProfile } from '../SellerProfile';
import { RelatedProducts } from '../RelatedProducts';
import { TrustBadges } from '../TrustBadges';
import '../../css/ProductDetails.css';

// Copy mockProducts từ Products.js
const mockProducts = [
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
  }
];

export default function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = params.get('id');
    setLoading(true);
    setTimeout(() => {
      // Tìm sản phẩm theo id
      const foundProduct = mockProducts.find((p) => p.id === Number(productId));
      // Chuyển đổi cho tương thích với các prop trong giao diện
      if (foundProduct) {
        setProduct({
          ...foundProduct,
          title: foundProduct.name,
          imageUrl: foundProduct.images[0],
          additionalImages: foundProduct.images.slice(1),
        });
      } else {
        setProduct(null);
      }
      setLoading(false);
    }, 400);
  }, [location.search]);

  if (loading) {
    return (
      <div className="bg-light min-vh-100 d-flex flex-column">
        <NavbarComponent />
        <Container className="flex-grow-1 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </Container>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-light min-vh-100 d-flex flex-column">
        <NavbarComponent />
        <Container className="flex-grow-1 d-flex flex-column justify-content-center align-items-center py-5">
          <h1 className="mb-3">Product Not Found</h1>
          <p className="text-muted mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Button variant="primary" onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <NavbarComponent />
      <Container className="py-4 flex-grow-1">
        {/* Back button */}
        <Button
          variant="link"
          className="px-0 mb-3 text-muted"
          onClick={() => navigate(-1)}
          style={{ textDecoration: "none" }}
        >
          <ArrowLeft size={18} className="me-1" /> Back to results
        </Button>

        <Row className="g-4 mb-4">
          {/* Product Images */}
          <Col md={7}>
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <ImageGallery
                  images={[product.imageUrl, ...(product.additionalImages || [])]}
                  productTitle={product.title}
                />
              </Card.Body>
            </Card>
          </Col>
          {/* Product Details */}
          <Col md={5}>
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h2 className="fs-4 fw-bold">{product.title}</h2>
                  <Button
                    variant="link"
                    className={`p-2 ${isFavorite ? "text-warning" : "text-muted"}`}
                    onClick={() => setIsFavorite(fav => !fav)}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart size={24} fill={isFavorite ? "#ff9500" : "none"} />
                  </Button>
                </div>
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                  <Badge bg="warning" text="dark">{product.condition}</Badge>
                  <span className="d-flex align-items-center text-warning">
                    <Star size={16} fill="#facc15" className="me-1" />
                    {product.sellerRating}
                    <span className="text-muted ms-1">(Seller Rating)</span>
                  </span>
                  <span className="d-flex align-items-center text-muted">
                    <Clock size={16} className="me-1" />
                    Listed {product.listedDate}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="fs-2 fw-bold">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="fs-5 text-muted text-decoration-line-through ms-2">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <div className="text-success fw-medium">
                      Save ${(product.originalPrice - product.price).toFixed(2)} ({Math.round((1 - product.price / product.originalPrice) * 100)}% off)
                    </div>
                  )}
                </div>
                <div className="d-grid gap-2 mb-3">
                  <Button
                    variant="warning"
                    size="lg"
                    className="text-white"
                    onClick={() => navigate(`/payment?id=${product.id}`)}
                  >
                    Buy Now
                  </Button>
                  <Button variant="outline-secondary" size="lg">
                    Make an Offer
                  </Button>
                  <div className="d-flex align-items-start text-success mt-2 small">
                    <Shield size={18} className="me-2" />
                    <span>This item is eligible for our buyer protection program</span>
                  </div>
                </div>
                {product.location && (
                  <div className="d-flex align-items-center text-muted mb-2">
                    <MapPin size={16} className="me-1" />
                    {product.location}
                  </div>
                )}
                <div className="d-flex justify-content-between text-muted small mb-2">
                  <div className="d-flex align-items-center">
                    <Calendar size={16} className="me-1" />
                    Available Now
                  </div>
                  <div>
                    ID: P{product.id.toString().padStart(5, "0")}
                  </div>
                </div>
              </Card.Body>
            </Card>
            <ConditionExplainer condition={product.condition} />
            {/* Seller Profile - Mobile Only */}
            <div className="d-md-none">
              <SellerProfile sellerName={product.sellerName} sellerRating={product.sellerRating} location={product.location} />
            </div>
          </Col>
        </Row>
        {/* Description */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h4 className="mb-3">Product Description</h4>
            <div className="text-muted">{product.description}</div>
          </Card.Body>
        </Card>
        {/* Specs & Seller */}
        <Row className="mb-4">
          <Col md={6}>
            <ProductSpecifications
              specifications={product.specifications || {}}
              product={product} // Thêm dòng này!
            />
          </Col>
          <Col md={6} className="d-none d-md-block">
            <SellerProfile sellerName={product.sellerName} sellerRating={product.sellerRating} location={product.location} />
          </Col>
        </Row>
        {/* Trust Badges */}
        <TrustBadges />
        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} currentCategory={product.category} />
      </Container>
      {/* Share button */}
      <Button
        variant="warning"
        className="rounded-circle position-fixed text-white"
        style={{ bottom: 24, right: 24, width: 48, height: 48, zIndex: 1000 }}
        aria-label="Share product"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: product.title,
              text: `Check out this ${product.title}!`,
              url: window.location.href,
            }).catch(err => console.error('Error sharing:', err));
          } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </Button>
      <Footer />
    </div>
  );
}
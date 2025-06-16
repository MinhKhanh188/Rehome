// front-end/src/components/pages/market/ProductDetails.js
import axios from 'axios';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  MapPin,
  Shield,
  Star,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';
import '../../css/ProductDetails.css';
import { ConditionExplainer } from '../ConditionExplainer';
import { ImageGallery } from '../ImageGallery';
import { Footer } from '../layout/Footer';
import { NavbarComponent } from '../layout/Navbar';
import { ProductSpecifications } from '../ProductSpecifications';
import { RelatedProducts } from '../RelatedProducts';
import { SellerProfile } from '../SellerProfile';
import { TrustBadges } from '../TrustBadges';



export default function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(NAME_CONFIG.TOKEN);
    const params = new URLSearchParams(location.search);
    const productId = params.get('id');

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_ENDPOINTS.GET_POST_DETAIL_BY_ID}/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`  
            },
          }

        );
        if (data) {
          setProduct({
            ...data,
            title: data.name || data.title,
            imageUrl: data.images?.[0] || '',
            additionalImages: data.images?.slice(1) || [],
          });
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
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
          <ArrowLeft size={18} className="me-1" /> Trở Lại
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
                  <Badge bg="warning" text="dark">{product.productStatus}</Badge>
                  <span className="d-flex align-items-center text-warning">
                    <Star size={16} fill="#facc15" className="me-1" />
                    {product.sellerRating}
                    <span className="text-muted ms-1">(Đánh Giá Người Bán)</span>
                  </span>
                  <div className='w-100'></div>
                  <span className="d-flex align-items-center text-muted">
                    <Clock size={16} className="me-1" />
                     Đăng lúc: {product.uploadDate ? new Date(product.uploadDate).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="fs-2 fw-bold">
                    {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </span>
                  {product.originalPrice && (
                    <span className="fs-5 text-muted text-decoration-line-through ms-2">
                      {product.originalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                  )}
                  {product.originalPrice && (
                    <div className="text-success fw-medium">
                      <span className="me-1">Tiết Kiệm</span>
                      {(
                        product.originalPrice - product.price
                      ).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} (Giảm {Math.round((1 - product.price / product.originalPrice) * 100)}%)
                    </div>
                  )}
                </div>
                <div className="d-grid gap-2 mb-3">
                  <Button
                    variant="warning"
                    size="lg"
                    className="text-white"
                    // onClick={() => navigate(`/payment?id=${product._id}`)}
                    onClick={() => alert('Chức năng này hiện tại chưa được triển khai.')}
                  >
                    Mua Ngay
                  </Button>
                  <Button variant="outline-secondary" size="lg">
                    Đưa Ra Đề Nghị
                  </Button>
                  <div className="d-flex align-items-start text-success mt-2 small">
                    <Shield size={18} className="me-2" />
                    <span>Sản phẩm đủ điều kiện cho chính sách bảo vệ người mua của chúng tôi</span>
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
                    Có Sẵn Ngay
                  </div>
                  <div>
                    ID: P{product._id?.slice(-5)}
                  </div>
                </div>
              </Card.Body>
            </Card>
            <ConditionExplainer condition={product.productStatus} />
            {/* Seller Profile - Mobile Only */}
            <div className="d-md-none">
              <SellerProfile sellerName={product.sellerName} sellerRating={product.sellerRating} location={product.location} />
            </div>
          </Col>
        </Row>
        {/* Description */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h4 className="mb-3">Mô Tả Sản Phẩm</h4>
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
          {/* <Col md={6} className="d-none d-md-block">
            <SellerProfile sellerName={product.sellerName} sellerRating={product.sellerRating} location={product.province} />
          </Col> */}
        </Row>
        {/* Trust Badges */}
        {/* <TrustBadges /> */}
        {/* Related Products */}
        <RelatedProducts currentProductId={product._id} currentCategory={product.category} />
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
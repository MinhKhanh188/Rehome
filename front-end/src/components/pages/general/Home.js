// App.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Leaf, Recycle, ShieldCheck, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../layout/Navbar";
import { Banner } from "../layout/Banner";
import { CategoryCard } from "../layout/CategoryCard";
import { ProductCard } from "../layout/ProductCard";
import { Footer } from "../layout/Footer";
import { API_ENDPOINTS } from '../../../config';
import '../../css/Home.css';

export default function Home() {
  const navigate = useNavigate();

  const categories = [
    { id: 'electronics', title: "Electronics", icon: "📱", path: "/category/electronics", description: "Phones, laptops & more" },
    { id: 'appliances', title: "Appliances", icon: "🧺", path: "/category/appliances", description: "Home essentials" },
    { id: 'furniture', title: "Furniture", icon: "🛋️", path: "/category/furniture", description: "Home decor" },
    { id: 'kitchen', title: "Kitchen", icon: "🍳", path: "/category/kitchen", description: "Cookware & appliances" },
    { id: 'decor', title: "Home Decor", icon: "🏠", path: "/category/decor", description: "Decorative items" },
    { id: 'garden', title: "Garden", icon: "🌻", path: "/category/garden", description: "Outdoor & gardening" },
    { id: 'lighting', title: "Lighting", icon: "💡", path: "/category/lighting", description: "Lamps & lighting" },
    { id: 'office', title: "Office", icon: "🖊️", path: "/category/office", description: "Office furniture & supplies" },
  ];

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    // Gọi API lấy danh sách sản phẩm VIP
    const fetchVipProducts = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.GET_ALL_VIP_POSTS}`);
        const data = await res.json();
        // data.posts là danh sách sản phẩm VIP đã duyệt
        setFeaturedProducts(data.posts || []);
        // Lấy 4 sản phẩm VIP mới nhất cho Recently Added
        setRecentProducts(
          (data.posts || [])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4)
        );
      } catch (err) {
        setFeaturedProducts([]);
        setRecentProducts([]);
      }
    };
    fetchVipProducts();
  }, []);

  return (
    <div className="app-container">
      <NavbarComponent />
      
      <main className="main-content">
        <section className="banner-section">
          <Banner />
        </section>
        
        <section className="categories-section">
          <div className="section-header">
            <h2>Browse Categories</h2>
            <p>Find quality secondhand items by category</p>
          </div>
          
          <div className="categories-grid">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id}
                title={category.title}
                icon={<span className="category-icon">{category.icon}</span>}
                path={category.path}
                description={category.description}
              />
            ))}
          </div>
        </section>
        
        <section className="products-section">
          <div className="section-header">
            <div className="title-container">
              <h2>Featured Items</h2>
            </div>
            <p>Premium secondhand products from our verified sellers</p>
          </div>
          
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div
                key={product._id || product.id}
                onClick={() => navigate(`/product?id=${product._id || product.id}`)}
                className="product-card-wrapper"
              >
                <ProductCard
                  id={product._id || product.id}
                  title={product.name}
                  price={product.price}
                  condition={product.productStatus}
                  imageUrl={product.images?.[0]}
                  isVip={product.isVip}
                />
              </div>
            ))}
          </div>
        </section>
        
        <section className="products-section">
          <div className="section-header">
            <h2>Recently Added</h2>
            <p>The latest secondhand items that just arrived</p>
          </div>
          
          <div className="products-grid">
            {recentProducts.map((product) => (
              <div
                key={product._id || product.id}
                onClick={() => navigate(`/product?id=${product._id || product.id}`)}
                className="product-card-wrapper"
              >
                <ProductCard
                  id={product._id || product.id}
                  title={product.name}
                  price={product.price}
                  condition={product.productStatus}
                  imageUrl={product.images?.[0]}
                  isVip={product.isVip}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Environmental Benefits Section */}
        <section className="environmental-benefits py-5 bg-white">
        <Container>
          <div className="text-center mb-5">
            <h2 className="benefits-title mb-3">Why Choose Secondhand?</h2>
            <p className="benefits-text mx-auto">
              Every garment you buy secondhand helps create a more sustainable future. Here's how your choices make an impact:
            </p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <Card className="benefit-card text-center">
                <Card.Body>
                  <div className="icon-circle mx-auto mb-4">
                    <Leaf className="benefit-icon" size={28} />
                  </div>
                  <h3 className="benefit-card-title mb-3">Reduces Waste</h3>
                  <Card.Text className="benefit-card-text">
                    Extends the lifecycle of clothing items that would otherwise end up in landfills, reducing textile waste.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="benefit-card text-center">
                <Card.Body>
                  <div className="icon-circle mx-auto mb-4">
                    <Recycle className="benefit-icon" size={28} />
                  </div>
                  <h3 className="benefit-card-title mb-3">Saves Resources</h3>
                  <Card.Text className="benefit-card-text">
                    Each secondhand purchase saves thousands of liters of water and reduces carbon emissions from new clothing production.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="benefit-card text-center">
                <Card.Body>
                  <div className="icon-circle mx-auto mb-4">
                    <ShieldCheck className="benefit-icon" size={28} />
                  </div>
                  <h3 className="benefit-card-title mb-3">Ethical Shopping</h3>
                  <Card.Text className="benefit-card-text">
                    Support a circular economy and reduce the demand for fast fashion's often and unethical production practices.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Quality Assurance Section */}
      <section className="quality-assurance py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col md={6}>
              <h2 className="quality-title mb-4">Our Quality Promise</h2>
              <p className="quality-text mb-4">
                Every item on Re:Wear goes through our meticulous quality assurance process. We carefully inspect, clean, and authenticate each piece to ensure you receive only the best secondhand items.
              </p>
              
              <ul className="quality-list">
                <li className="d-flex align-items-start mb-3">
                  <CheckCircle className="quality-icon me-3" size={20} />
                  <span>
                    <strong>Thorough Inspection:</strong> Each item is carefully examined for any damage or wear.
                  </span>
                </li>
                <li className="d-flex align-items-start mb-3">
                  <CheckCircle className="quality-icon me-3" size={20} />
                  <span>
                    <strong>Professional Cleaning:</strong> All items are professionally cleaned and sanitized.
                  </span>
                </li>
                <li className="d-flex align-items-start mb-3">
                  <CheckCircle className="quality-icon me-3" size={20} />
                  <span>
                    <strong>Condition Rating:</strong> Every piece receives a transparent condition rating.
                  </span>
                </li>
                <li className="d-flex align-items-start">
                  <CheckCircle className="quality-icon me-3" size={20} />
                  <span>
                    <strong>Authenticity Verification:</strong> Brand name items are authenticated to ensure genuineness.
                  </span>
                </li>
              </ul>
            </Col>

            <Col md={6}>
              <Card className="quality-image-card shadow">
                <Card.Body className="p-1">
                  <div className="image-placeholder rounded">
                    <div className="text-center p-5">
                      <div className="icon-circle-large mx-auto mb-4">
                        <ShieldCheck className="benefit-icon" size={36} />
                      </div>
                      <p className="placeholder-text">Quality Assurance Image Placeholder</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works py-5 bg-white">
        <Container>
          <div className="text-center mb-5">
            <h2 className="how-it-works-title mb-3">How Re-Home Works</h2>
            <p className="how-it-works-text mx-auto">
              Discover the simple process of finding sustainable fashion treasures.
            </p>
          </div>

          <Row className="g-4 position-relative">
            <Col md={4}>
              <div className="step-item text-center text-md-start">
                <div className="step-number mb-4">
                  <span>1</span>
                </div>
                <h3 className="step-title mb-3">Browse Our Collection</h3>
                <p className="step-text">
                  Explore our carefully curated collection of high-quality secondhand clothing items across various categories and styles.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="step-item text-center text-md-start">
                <div className="step-number mb-4">
                  <span>2</span>
                </div>
                <h3 className="step-title mb-3">Find Your Perfect Match</h3>
                <p className="step-text">
                  Use our detailed descriptions, sizing information, and condition ratings to find items that match your style and expectations.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="step-item text-center text-md-start">
                <div className="step-number mb-4">
                  <span>3</span>
                </div>
                <h3 className="step-title mb-3">Sustainable Delivery</h3>
                <p className="step-text">
                  Receive your items with our eco-friendly packaging, and start enjoying sustainable fashion that looks good and feels good.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
        
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to give your items a second life?</h2>
            <p>Join thousands of users who buy and sell quality secondhand items. 
              It's good for your wallet and better for the planet.</p>
            <div className="cta-buttons">
              <button className="primary-btn">Start Selling</button>
              <button 
                className="secondary-btn"
                onClick={() => navigate('/products')}
              >
                Browse Items
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
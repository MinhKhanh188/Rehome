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
    { id: 'Thiết Bị Điện Tử', name: 'Thiết Bị Điện Tử', icon: '💻', path: '/thiet-bi-dien-tu', description: 'Các sản phẩm điện tử như laptop, máy tính bảng, tivi...' },
    { id: 'Thời Trang Nam', name: 'Thời Trang Nam', icon: '👔', path: '/thoi-trang-nam', description: 'Quần áo, giày dép, phụ kiện thời trang dành cho nam giới.' },
    { id: 'Thời Trang Nữ', name: 'Thời Trang Nữ', icon: '👗', path: '/thoi-trang-nu', description: 'Trang phục, giày dép, phụ kiện thời trang dành cho nữ giới.' },
    { id: 'Phụ Kiện Nam', name: 'Phụ Kiện Nam', icon: '🕶️', path: '/phu-kien-nam', description: 'Phụ kiện dành cho nam như mắt kính, đồng hồ, ví da...' },
    { id: 'Phụ Kiện Nữ', name: 'Phụ Kiện Nữ', icon: '👝', path: '/phu-kien-nu', description: 'Túi xách, trang sức, phụ kiện thời trang cho nữ.' },
    { id: 'Điện Thoại & Phụ Kiện', name: 'Điện Thoại & Phụ Kiện', icon: '📱', path: '/dien-thoai-va-phu-kien', description: 'Điện thoại di động, ốp lưng, sạc, tai nghe và phụ kiện đi kèm.' },
    { id: 'Thiết Bị Điện Gia Dụng', name: 'Thiết Bị Điện Gia Dụng', icon: '🔌', path: '/thiet-bi-dien-gia-dung', description: 'Thiết bị điện cho gia đình như nồi cơm điện, lò vi sóng...' },
    { id: 'Đồ Gia Dụng', name: 'Đồ Gia Dụng', icon: '🧺', path: '/do-gia-dung', description: 'Vật dụng gia đình như chổi, xô, thùng rác, dụng cụ dọn dẹp...' },
    { id: 'Đồ Dùng Cá Nhân', name: 'Đồ Dùng Cá Nhân', icon: '🧴', path: '/do-dung-ca-nhan', description: 'Sản phẩm chăm sóc cá nhân như bàn chải, dao cạo, dầu gội...' },
    { id: 'Mỹ Phẩm', name: 'Mỹ Phẩm', icon: '💄', path: '/my-pham', description: 'Các sản phẩm trang điểm, chăm sóc da, dưỡng da...' },
    { id: 'Nội Thất', name: 'Nội Thất', icon: '🛋️', path: '/noi-that', description: 'Đồ nội thất như bàn ghế, giường, tủ, kệ sách...' },
    { id: 'Dụng Cụ Thể Thao', name: 'Dụng Cụ Thể Thao', icon: '🏀', path: '/dung-cu-the-thao', description: 'Dụng cụ luyện tập, thể thao như bóng, vợt, thảm tập...' },
    { id: 'Giáo Dục', name: 'Giáo Dục', icon: '📚', path: '/giao-duc', description: 'Sách vở, tài liệu học tập, đồ dùng học sinh - sinh viên.' }

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
            <h2>Khám phá Danh mục</h2>
            <p>Tìm các sản phẩm đồ cũ chất lượng qua các danh mục</p>
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
              <h2>Sản phẩm Nổi bật</h2>
            </div>
            <p>Sản phẩm đồ cũ cao cấp từ những người bán đã được xác minh.</p>
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
            <h2>Mới thêm gần đây</h2>
            <p>Những món đồ cũ được thêm gần đây</p>
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
              <h2 className="benefits-title mb-3">Tại sao nên chọn đồ cũ?</h2>
              <p className="benefits-text mx-auto">
                Mỗi món đồ bạn mua lại đều góp phần xây dựng một tương lai bền vững hơn. Đây là cách các lựa chọn của bạn tạo ra sự ảnh hưởng:
              </p>
            </div>

            <Row className="g-4">
              <Col md={4}>
                <Card className="benefit-card text-center">
                  <Card.Body>
                    <div className="icon-circle mx-auto mb-4">
                      <Leaf className="benefit-icon" size={28} />
                    </div>
                    <h3 className="benefit-card-title mb-3">Giảm lượng rác thải ra môi trường</h3>
                    <Card.Text className="benefit-card-text">
                      Kéo dài vòng đời của sản phẩm vốn có thể bị thải ra bãi rác, giúp giảm lượng rác thải ngoài môi trường.
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
                    <h3 className="benefit-card-title mb-3">Tiết kiệm tài nguyên và năng lượng</h3>
                    <Card.Text className="benefit-card-text">
                      Mỗi lần mua đồ cũ giúp tiết kiệm hàng nghìn lít nước và giảm lượng khí thải carbon từ quá trình sản xuất sản phẩm mới.
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
                    <h3 className="benefit-card-title mb-3">Lựa chọn mua sắm có đạo đức hơn</h3>
                    <Card.Text className="benefit-card-text">
                      Hỗ trợ nền kinh tế tuần hoàn và xây dựng một lối sống tiêu dùng có trách nhiệm hơn.
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
                <h2 className="quality-title mb-4">Cam Kết Chất Lượng Của Chúng Tôi</h2>
                <p className="quality-text mb-4">
                  Mỗi sản phẩm trên Re-Home đều trải qua quy trình đảm bảo chất lượng tỉ mỉ của chúng tôi để đảm bảo bạn chỉ nhận được những sản phẩm đã qua sử dụng tốt nhất.
                </p>

                <ul className="quality-list">
                  <li className="d-flex align-items-start mb-3">
                    <CheckCircle className="quality-icon me-3" size={20} />
                    <span>
                      <strong>Kiểm Tra Kỹ Lưỡng:</strong> Mỗi sản phẩm được kiểm tra cẩn thận để phát hiện bất kỳ hư hỏng hoặc hao mòn nào.
                    </span>
                  </li>
                  <li className="d-flex align-items-start mb-3">
                    <CheckCircle className="quality-icon me-3" size={20} />
                    <span>
                      <strong>Vệ Sinh Chuyên Nghiệp:</strong> Tất cả sản phẩm được vệ sinh và khử trùng một cách chuyên nghiệp.
                    </span>
                  </li>
                  <li className="d-flex align-items-start mb-3">
                    <CheckCircle className="quality-icon me-3" size={20} />
                    <span>
                      <strong>Đánh Giá Tình Trạng:</strong> Mỗi sản phẩm đều nhận được đánh giá tình trạng minh bạch.
                    </span>
                  </li>
                  <li className="d-flex align-items-start">
                    <CheckCircle className="quality-icon me-3" size={20} />
                    <span>
                      <strong>Xác Minh Tính Chính Hãng:</strong> Các sản phẩm thương hiệu được xác thực để đảm bảo tính chính hãng.
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
                        <p className="placeholder-text">Hình Ảnh Minh Họa Đảm Bảo Chất Lượng</p>
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
              <h2 className="how-it-works-title mb-3">Re-Home hoạt động như thế nào</h2>
              <p className="how-it-works-text mx-auto">
                Khám phá quy trình đơn giản để tìm kiếm những món đồ cũ chất lượng và tiết kiệm.
              </p>
            </div>

            <Row className="g-4 position-relative">
              <Col md={4}>
                <div className="step-item text-center text-md-start">
                  <div className="step-number mb-4">
                    <span>1</span>
                  </div>
                  <h3 className="step-title mb-3">Duyệt Qua Các Danh Mục Của Chúng Tôi</h3>
                  <p className="step-text">
                    Khám phá các danh mục với đa dạng sản phẩm đã qua sử dụng chất lượng cao bao gồm thiết bị điện tử, đồ gia dụng, dụng cụ nhà bếp và nhiều danh mục khác.
                  </p>
                </div>
              </Col>

              <Col md={4}>
                <div className="step-item text-center text-md-start">
                  <div className="step-number mb-4">
                    <span>2</span>
                  </div>
                  <h3 className="step-title mb-3">Tìm Sản Phẩm Hoàn Hảo Cho Bạn</h3>
                  <p className="step-text">
                    Sử dụng mô tả chi tiết, thông tin kỹ thuật và đánh giá tình trạng của chúng tôi để tìm những sản phẩm phù hợp với nhu cầu và mong đợi của bạn.
                  </p>
                </div>
              </Col>

              <Col md={4}>
                <div className="step-item text-center text-md-start">
                  <div className="step-number mb-4">
                    <span>3</span>
                  </div>
                  <h3 className="step-title mb-3">Giao Hàng Bền Vững</h3>
                  <p className="step-text">
                    Nhận sản phẩm của bạn với bao bì thân thiện với môi trường, và bắt đầu tận hưởng những sản phẩm chất lượng với giá cả hợp lý và thân thiện với môi trường.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2>Sẵn sàng cho món đồ của bạn một cuộc sống thứ hai?</h2>
            <div><span style={{fontSize: '18px'}}>Tham gia cùng hàng nghìn người dùng mua và bán các món đồ đã qua sử dụng chất lượng.</span>
            <p>Vừa nhẹ ví tiền, vừa chất vì hành tinh – mua đồ cũ chưa bao giờ "xanh" mà vẫn "chất" đến thế!</p></div>
            <div className="cta-buttons">
              <button className="primary-btn" onClick={() => navigate('/dashboard/new-listing')}>Bắt đầu bán hàng</button>
              <button
                className="secondary-btn"
                onClick={() => navigate('/products')}
              >
                Mua sắm ngay
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
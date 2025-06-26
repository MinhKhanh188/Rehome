// front-end/src/components/pages/general/AboutUs.js
import React from "react";
import { Col, Row, Container, Card } from "react-bootstrap";
import { NavbarComponent } from "../layout/Navbar";
import '../../css/AboutUs.css';

const AboutUs = () => {
    return (
        <>
            <NavbarComponent />
            <div className="about-us-page">
                <Container className="about-container mt-5">
                    <Col md={10} className="mx-auto">
                        <h1 className="mb-4 text-center">Về chúng tôi</h1>
                        <p>
                            <strong style={{ color: "#f97316" }}>Re-Home</strong> không chỉ là một nền tảng – đó là tâm huyết của chúng tôi.
                            Dự án này được tạo ra bằng tình yêu công nghệ, sự kiên trì và khát vọng đóng góp cho cộng đồng.
                            Chúng tôi tin rằng việc tái sử dụng không chỉ giúp tiết kiệm mà còn là hành động tử tế với môi trường và xã hội.
                        </p>
                        <p>
                            Từng dòng code, từng giao diện là kết quả của những đêm dài thức trắng,
                            những giờ học tập và làm việc không ngừng nghỉ – tất cả nhằm mang đến một sản phẩm mang giá trị thực tiễn và nhân văn.
                        </p>
                        <p>
                            Chúng tôi hy vọng <strong style={{ color: "#f97316" }}>Re-Home</strong> không chỉ giúp bạn tìm được món đồ phù hợp,
                            mà còn truyền cảm hứng sống xanh, sống bền vững.
                            Cảm ơn bạn đã ghé thăm và đồng hành cùng chúng tôi trên hành trình này.
                        </p>

                        <h2 className="mt-5">Những người tạo ra dự án Re-Home</h2>
                        <ul>
                            <li>Lê Thị Mỹ Lệ</li>
                            <li>Nguyễn Đạt</li>
                            <li>Tống Quốc Đạt</li>
                            <li>Trương Ngọc Lân</li>
                            <li>Cồ Huy Hoàng</li>
                            <li>Phạm Minh Khánh</li>
                        </ul>

                        <h2 className="mt-5">Những người phát triển website Re-Home</h2>
                        <Row className="mt-4">
                            <Col md={4} className="mb-3">
                                <Card className="about-card">
                                    <Card.Body>
                                        <Card.Title className="about-title">Phạm Minh Khánh</Card.Title>
                                        <Card.Text className="about-text">
                                            • Back-end Developer<br />
                                            • Front-end Developer<br />
                                            • DevOps<br />
                                            • Designer
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={4} className="mb-3">
                                <Card className="about-card">
                                    <Card.Body>
                                        <Card.Title className="about-title">Cồ Huy Hoàng</Card.Title>
                                        <Card.Text className="about-text">
                                            • Front-end Developer<br />
                                            • Designer
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={4} className="mb-3">
                                <Card className="about-card">
                                    <Card.Body>
                                        <Card.Title className="about-title">Lê Thị Mỹ Lệ</Card.Title>
                                        <Card.Text className="about-text">
                                            • Logo Designer
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Container>
            </div>
        </>
    );
};

export default AboutUs;

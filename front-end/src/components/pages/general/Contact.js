// front-end/src/components/pages/general/Contact.js
import React from "react";
import { Col, Row, Container, Card } from "react-bootstrap";
import { NavbarComponent } from "../layout/Navbar";
import '../../css/Contact.css';

const Contact = () => {
    return (
        <div>
            <NavbarComponent />
            <Container>
                <Row>
                    <Col>
                        <Card className="contact-card">
                            <Card.Body>
                                <Card.Title className="contact-title">Liên hệ với chúng tôi</Card.Title>
                                <Card.Text className="contact-text">
                                    Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua email dưới đây:
                                </Card.Text>
                                <Card.Text className="contact-info">
                                    Email: <a href="mailto:datnqd1802@gmail.con">datnqd1802@gmail.com</a>
                                </Card.Text>
                                <Card.Text className="contact-info">
                                    Số điện thoại: <a href="tel:0985240770">0985240770</a>
                                </Card.Text>
                                <Card.Text className="contact-text">
                                    Nếu bạn có thắc mắc về kỹ thuật, vui lòng liên hệ với chúng tôi qua email dưới đây:
                                </Card.Text>
                                <Card.Text className="contact-info">
                                    Email: <a href="mailto:jokhanh188@gmail.com">jokhanh188@gmail.com</a>
                                </Card.Text>
                                <Card.Text className="contact-info">
                                    Số điện thoại: <a href="tel:0325337641">0325337641</a>
                                </Card.Text>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Contact;

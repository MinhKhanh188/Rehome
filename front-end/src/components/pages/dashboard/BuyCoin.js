// front-end/src/components/pages/dashboard/BuyCoin.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';

export default function BuyCoin() {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('qr-code');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [uniqueId, setUniqueId] = useState('');
    const [coin, setCoin] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem(NAME_CONFIG.TOKEN);
        if (!token) return;

        axios.get(`${API_ENDPOINTS.GET_USER_PROFILE}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                setUniqueId(res.data.user.uniqueId);
                setCoin(res.data.user.coin); // Lấy số coin
            })
            .catch((err) => {
                console.error('Failed to fetch unique ID:', err);
            })

    }, []);



    return (
        <div className="payment-container">
            <main className="main-content">
                <Container>
                    <Button
                        variant="link"
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={16} className="me-1" />
                        Quay lại
                    </Button>

                    <h1 className="page-title">
                        Thanh toán
                    </h1>
                    <div className="ms-3 fs-5 text-info">Số xu hiện tại: <b>{coin.toLocaleString('vi-VN')}</b></div>
                    <Row className="checkout-section">
                        <Col lg={8}>
                            <Card className="payment-card mb-4">
                                <Card.Body className="p-4">
                                    <h2 className="section-title">Phương thức thanh toán</h2>

                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="radio"
                                            id="qr-code"
                                            label={
                                                <span className="d-flex align-items-center">
                                                    <svg className="payment-icon me-2" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                        <rect x="3" y="3" width="6" height="6" stroke="#0ea5e9" strokeWidth="2" />
                                                        <rect x="15" y="3" width="6" height="6" stroke="#0ea5e9" strokeWidth="2" />
                                                        <rect x="3" y="15" width="6" height="6" stroke="#0ea5e9" strokeWidth="2" />
                                                        <rect x="10" y="10" width="4" height="4" stroke="#0ea5e9" strokeWidth="2" />
                                                        <rect x="15" y="15" width="6" height="6" stroke="#0ea5e9" strokeWidth="2" />
                                                    </svg>
                                                    QR Code (Momo, VietQR, v.v.)
                                                </span>
                                            }
                                            checked={paymentMethod === 'qr-code'}
                                            onChange={() => setPaymentMethod('qr-code')}
                                        />
                                    </Form.Group>

                                    <div className="qr-payment-info text-center py-3">
                                        <p className="mb-2 text-muted">Quét mã QR để thanh toán bằng ứng dụng ngân hàng hoặc ví điện tử:</p>
                                        <img
                                            src="/images/qr.jpg"
                                            alt="QR Code"
                                            style={{
                                                width: 180,
                                                height: 180,
                                                objectFit: 'contain',
                                                background: '#fff',
                                                border: '1px solid #eee',
                                                borderRadius: 8
                                            }}
                                        />
                                        <div className="mt-2 small text-muted">
                                            Với nội dung: <b> {uniqueId}</b>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card className="p-3 bg-light border">
                                <h5 className="mb-3">📜 Quy Định Phí Đăng Bán – Re-Home</h5>
                                <p>
                                    Để đảm bảo chất lượng dịch vụ và duy trì hệ thống kiểm duyệt sản phẩm, Re-Home áp dụng mức phí đăng bán sản phẩm như sau:
                                </p>
                                <table className="table table-sm table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Giá trị sản phẩm</th>
                                            <th>Phí đăng bán</th>
                                            <th>Quy đổi xu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>Dưới 500.000 VNĐ</td><td>5.000 VNĐ</td><td>5.000 xu</td></tr>
                                        <tr><td>500.000 – 1.000.000 VNĐ</td><td>15.000 VNĐ</td><td>15.000 xu</td></tr>
                                        <tr><td>1.000.000 – 5.000.000 VNĐ</td><td>30.000 VNĐ</td><td>30.000 xu</td></tr>
                                        <tr><td>Trên 5.000.000 VNĐ</td><td>50.000 VNĐ</td><td>50.000 xu</td></tr>
                                    </tbody>
                                </table>

                                <p><strong>🔄 Tỉ lệ quy đổi:</strong> 1.000 VNĐ = 1.000 xu</p>
                                <p>Người dùng có thể nạp xu trong ví cá nhân để sử dụng cho các hoạt động trên nền tảng.</p>

                                <ul style={{ paddingLeft: 16 }}>
                                    <li>Phí đăng bán được tính mỗi sản phẩm khi gửi yêu cầu kiểm duyệt.</li>
                                    <li>Sản phẩm chỉ hiển thị công khai sau khi kiểm duyệt và thanh toán phí.</li>
                                    <li>Phí đăng bán không hoàn lại, kể cả khi xoá bài hoặc không bán được.</li>
                                    <li>Sản phẩm vi phạm hoặc không đạt yêu cầu sẽ bị từ chối và không hoàn phí.</li>
                                </ul>
                            </Card>
                        </Col>

                    </Row>
                </Container>
            </main>
        </div>
    );
}

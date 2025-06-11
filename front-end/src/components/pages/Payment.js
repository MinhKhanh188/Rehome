import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { ShieldCheck, CreditCard, ArrowLeft, Check, Truck } from 'lucide-react';
import { NavbarComponent } from './layout/Navbar';
import { Footer } from './layout/Footer';
import { API_ENDPOINTS, NAME_CONFIG } from '../../config'; // Thêm dòng này
import axios from 'axios'; // Thêm dòng này
import '../css/Payment.css';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // State for the product
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: '',
  });

  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Vietnam',
    phoneNumber: '',
  });

  // Order summary state
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 15,
    tax: 0,
    total: 0,
  });

  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Load product details từ API
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = params.get('id');

    if (!productId) {
      navigate('/products');
      return;
    }

    const loadProduct = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem(NAME_CONFIG.TOKEN);
        const { data } = await axios.get(`${API_ENDPOINTS.GET_POST_DETAIL_BY_ID}/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data) {
          setProduct({
            ...data,
            title: data.name || data.title,
            imageUrl: data.images?.[0] || '',
            condition: data.productStatus,
            price: data.price,
          });
          const subtotal = data.price;
          const shipping = 15;
          const tax = subtotal * 0.1;
          const total = subtotal + shipping + tax;
          setOrderSummary({ subtotal, shipping, tax, total });
        } else {
          navigate('/products');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [location.search, navigate]);

  // Handle card number input
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    let formattedValue = '';
    for (let i = 0; i < value.length; i += 4) {
      formattedValue += value.slice(i, i + 4) + ' ';
    }
    setCardDetails({ ...cardDetails, cardNumber: formattedValue.trim() });
  };

  // Handle expiry date input
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setCardDetails({ ...cardDetails, expiryDate: value });
  };

  // Handle CVV input
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardDetails({ ...cardDetails, cvv: value });
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    if (!shippingAddress.fullName) newErrors.fullName = 'Full name is required';
    if (!shippingAddress.addressLine1) newErrors.addressLine1 = 'Address is required';
    if (!shippingAddress.city) newErrors.city = 'City is required';
    if (!shippingAddress.state) newErrors.state = 'State/Province is required';
    if (!shippingAddress.zipCode) newErrors.zipCode = 'ZIP/Postal code is required';
    if (!shippingAddress.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (paymentMethod === 'credit-card') {
      if (!cardDetails.cardNumber) newErrors.cardNumber = 'Card number is required';
      else if (cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Invalid card number';
      }
      if (!cardDetails.nameOnCard) newErrors.nameOnCard = 'Name on card is required';
      if (!cardDetails.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      else {
        const [month, year] = cardDetails.expiryDate.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (parseInt(month) < 1 || parseInt(month) > 12) {
          newErrors.expiryDate = 'Invalid month';
        } else if (
          parseInt(year) < currentYear ||
          (parseInt(year) === currentYear && parseInt(month) < currentMonth)
        ) {
          newErrors.expiryDate = 'Card has expired';
        }
      }
      if (!cardDetails.cvv) newErrors.cvv = 'CVV is required';
      else if (cardDetails.cvv.length < 3) newErrors.cvv = 'Invalid CVV';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    setIsProcessingPayment(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate(`/payment-confirmation?id=${product?.id}`);
    } catch (error) {
      console.error('Payment processing error:', error);
      setErrors({ payment: 'Payment processing failed. Please try again.' });
    } finally {
      setIsProcessingPayment(false);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-container">
        <NavbarComponent />
        <main className="loading-container">
          <Spinner animation="border" variant="primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="payment-container">
        <NavbarComponent />
        <main className="not-found-container">
          <Container>
            <div className="text-center">
              <h1 className="not-found-title">Product Not Found</h1>
              <p className="not-found-text">
                The product you're looking for doesn't exist or has been removed.
              </p>
              <Button variant="primary" onClick={() => navigate('/products')}>
                Browse Products
              </Button>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="payment-container">
      <NavbarComponent />
      <main className="main-content">
        <Container>
          <Button
            variant="link"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="me-1" />
            Back to product
          </Button>

          <h1 className="page-title">Checkout</h1>

          <Row className="checkout-section">
            <Col lg={8}>
              <Form id="payment-form" onSubmit={handleSubmit}>
                <Card className="shipping-card mb-4">
                  <Card.Body className="p-4">
                    <h2 className="section-title">Shipping Address</h2>
                    <Row className="g-3">
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="form-label">Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            id="fullName"
                            value={shippingAddress.fullName}
                            onChange={(e) =>
                              setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                            }
                            isInvalid={!!errors.fullName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.fullName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="form-label">Address Line 1</Form.Label>
                          <Form.Control
                            type="text"
                            id="addressLine1"
                            value={shippingAddress.addressLine1}
                            onChange={(e) =>
                              setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })
                            }
                            isInvalid={!!errors.addressLine1}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.addressLine1}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="form-label">Address Line 2 (Optional)</Form.Label>
                          <Form.Control
                            type="text"
                            id="addressLine2"
                            value={shippingAddress.addressLine2}
                            onChange={(e) =>
                              setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="form-label">City</Form.Label>
                          <Form.Control
                            type="text"
                            id="city"
                            value={shippingAddress.city}
                            onChange={(e) =>
                              setShippingAddress({ ...shippingAddress, city: e.target.value })
                            }
                            isInvalid={!!errors.city}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.city}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="form-label">State/Province</Form.Label>
                          <Form.Control
                            type="text"
                            id="state"
                            value={shippingAddress.state}
                            onChange={(e) =>
                              setShippingAddress({ ...shippingAddress, state: e.target.value })
                            }
                            isInvalid={!!errors.state}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.state}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="form-label">ZIP/Postal Code</Form.Label>
                          <Form.Control
                            type="text"
                            id="zipCode"
                            value={shippingAddress.zipCode}
                            onChange={(e) =>
                              setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                            }
                            isInvalid={!!errors.zipCode}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.zipCode}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="form-label">Country</Form.Label>
                          <Form.Select
                            id="country"
                            value={shippingAddress.country}
                            onChange={(e) =>
                              setShippingAddress({ ...shippingAddress, country: e.target.value })
                            }
                          >
                            <option value="Vietnam">Vietnam</option>
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                            <option value="United Kingdom">United Kingdom</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="form-label">Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            id="phoneNumber"
                            value={shippingAddress.phoneNumber}
                            onChange={(e) =>
                              setShippingAddress({ ...shippingAddress, phoneNumber: e.target.value })
                            }
                            isInvalid={!!errors.phoneNumber}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.phoneNumber}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Card className="payment-card mb-4">
                  <Card.Body className="p-4">
                    <h2 className="section-title">Payment Method</h2>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="radio"
                        id="credit-card"
                        label={
                          <span className="d-flex align-items-center">
                            <CreditCard className="payment-icon me-2" />
                            Credit or Debit Card
                          </span>
                        }
                        checked={paymentMethod === 'credit-card'}
                        onChange={() => setPaymentMethod('credit-card')}
                      />
                    </Form.Group>
                    {paymentMethod === 'credit-card' && (
                      <div className="credit-card-details">
                        <Form.Group className="mb-3">
                          <Form.Label className="form-label">Card Number</Form.Label>
                          <Form.Control
                            type="text"
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.cardNumber}
                            onChange={handleCardNumberChange}
                            isInvalid={!!errors.cardNumber}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.cardNumber}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="form-label">Name on Card</Form.Label>
                          <Form.Control
                            type="text"
                            id="nameOnCard"
                            value={cardDetails.nameOnCard}
                            onChange={(e) =>
                              setCardDetails({ ...cardDetails, nameOnCard: e.target.value })
                            }
                            isInvalid={!!errors.nameOnCard}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.nameOnCard}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Row className="g-3">
                          <Col xs={6}>
                            <Form.Group>
                              <Form.Label className="form-label">Expiry Date (MM/YY)</Form.Label>
                              <Form.Control
                                type="text"
                                id="expiryDate"
                                placeholder="MM/YY"
                                value={cardDetails.expiryDate}
                                onChange={handleExpiryChange}
                                isInvalid={!!errors.expiryDate}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.expiryDate}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col xs={6}>
                            <Form.Group>
                              <Form.Label className="form-label">CVV</Form.Label>
                              <Form.Control
                                type="text"
                                id="cvv"
                                placeholder="123"
                                value={cardDetails.cvv}
                                onChange={handleCvvChange}
                                isInvalid={!!errors.cvv}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.cvv}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    )}
                    <Form.Group className="mt-3">
                      <Form.Check
                        type="radio"
                        id="paypal"
                        label={
                          <span className="d-flex align-items-center">
                            <svg
                              className="payment-icon me-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M20.067 7.706C20.067 10.153 18.448 11.921 16.082 11.921H14.559C14.144 11.921 13.814 12.251 13.763 12.663L13.193 16.817C13.147 17.146 12.864 17.379 12.531 17.379H10.499C10.171 17.379 9.932 17.093 9.981 16.77L11.456 6.621C11.518 6.225 11.858 5.936 12.258 5.936H16.503C18.62 5.936 20.067 6.548 20.067 7.706Z"
                                fill="#002C8A"
                              />
                              <path
                                d="M8.436 18.459L9.019 14.187C9.064 13.863 8.825 13.577 8.498 13.577H6.427C6.094 13.577 5.811 13.344 5.765 13.015L4.287 2.866C4.234 2.47 4.549 2.121 4.95 2.121H9.354C12.037 2.121 13.961 3.76 13.961 6.384C13.961 6.384 13.73 17.141 13.72 17.379C13.72 17.498 13.701 17.618 13.663 17.731C13.57 17.98 13.324 18.137 13.067 18.137H11.027L9.965 18.417C9.55 18.417 9.22 18.747 9.17 19.16L8.6 23.313C8.554 23.643 8.271 23.876 7.938 23.876H5.906C5.578 23.876 5.339 23.59 5.388 23.267L5.969 18.995C6.015 18.665 6.298 18.433 6.631 18.433H8.431"
                                fill="#009BE1"
                              />
                              <path
                                d="M13.961 6.384C13.961 6.384 13.73 17.141 13.72 17.379C13.72 17.498 13.701 17.618 13.663 17.731C13.57 17.98 13.324 18.137 13.067 18.137H11.027C10.617 18.137 10.277 17.847 10.215 17.452L8.74 7.302C8.691 6.979 8.931 6.693 9.258 6.693H11.33C11.662 6.693 11.946 6.926 11.991 7.255L12.573 11.408C12.624 11.82 12.954 12.15 13.369 12.15H14.892C17.258 12.15 18.877 10.382 18.877 7.935C18.877 6.777 17.43 6.165 15.313 6.165H13.961"
                                fill="#001F6B"
                              />
                            </svg>
                            PayPal
                          </span>
                        }
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                      />
                    </Form.Group>
                    {paymentMethod === 'paypal' && (
                      <div className="paypal-info">
                        <p className="text-muted">
                          You will be redirected to PayPal to complete your purchase securely.
                        </p>
                      </div>
                    )}
                    {errors.payment && (
                      <div className="payment-error">
                        <p>{errors.payment}</p>
                      </div>
                    )}
                    <Form.Group className="mt-3">
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
                    {paymentMethod === 'qr-code' && (
                      <div className="qr-payment-info text-center py-3">
                        <p className="mb-2 text-muted">Quét mã QR để thanh toán bằng ứng dụng ngân hàng hoặc ví điện tử:</p>
                        <img
                          src="/images/qr.jpg"
                          alt="QR Code"
                          style={{ width: 180, height: 180, objectFit: 'contain', background: '#fff', border: '1px solid #eee', borderRadius: 8 }}
                        />
                        <div className="mt-2 small text-muted">Vui lòng nhập nội dung: <b>Thanh toán đơn hàng #{product._id?.slice(-5)}</b></div>
                      </div>
                    )}

                    {errors.payment && (
                      <div className="payment-error">
                        <p>{errors.payment}</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>

                <div className="d-lg-none">
                  <Button
                    type="submit"
                    variant="primary"
                    className="pay-button w-100"
                    disabled={isSubmitting || isProcessingPayment}
                  >
                    {isProcessingPayment
                      ? 'Processing Payment...'
                      : `Pay $${orderSummary.total.toFixed(2)}`}
                  </Button>
                </div>
              </Form>
            </Col>

            <Col lg={4}>
              <Card className="order-summary-card sticky-top">
                <Card.Body className="p-4">
                  <h2 className="section-title">Order Summary</h2>
                  <div className="product-preview">
                    <div className="product-image-container">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="product-image"
                      // style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, background: '#f8fafc' }} // Sửa objectFit thành 'contain'

                      />
                    </div>
                    <div className="product-details">
                      <h3 className="product-title">{product.title}</h3>
                      <div className="product-condition">Tình trạng: {product.condition}</div>
                      <div className="product-price">
                        {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </div>
                    </div>
                  </div>
                  <div className="price-breakdown">
                    <div className="price-item">
                      <span>Tạm tính</span>
                      <span>{orderSummary.subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                    </div>
                    <div className="price-item">
                      <span>Phí vận chuyển</span>
                      <span>{orderSummary.shipping.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                    </div>
                    <div className="price-item">
                      <span>Thuế (10%)</span>
                      <span>{orderSummary.tax.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                    </div>
                    <div className="price-total">
                      <span>Tổng cộng</span>
                      <span>{orderSummary.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                    </div>
                  </div>
                  <div className="delivery-info">
                    <Truck className="truck-icon" />
                    <div>
                      <h4 className="delivery-title">Delivery Information</h4>
                      <p className="delivery-text">
                        Estimated delivery: 3-5 business days after seller ships
                      </p>
                    </div>
                  </div>
                  <div className="trust-badges">
                    <div className="trust-badge">
                      <ShieldCheck className="badge-icon" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="trust-badge">
                      <Check className="badge-icon" />
                      <span>Buyer protection program</span>
                    </div>
                  </div>
                  <div className="d-none d-lg-block">
                    <Button
                      type="submit"
                      form="payment-form"
                      variant="primary"
                      className="pay-button w-100"
                      disabled={isSubmitting || isProcessingPayment}
                    >
                      {isProcessingPayment
                        ? 'Processing Payment...'
                        : `Thanh toán ${orderSummary.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
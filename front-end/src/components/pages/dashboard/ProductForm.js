// front-end/src/components/pages/dashboard/ProductForm.js
import axios from 'axios';
import { AlertCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';
import '../../css/ProductForm.css';
import Swal from 'sweetalert2';

const conditions = ['Mới', 'Like-new', 'Cũ'];

const getPostCostByPrice = (price) => {
  if (price < 500000) return 5000;
  if (price <= 1000000) return 15000;
  if (price <= 5000000) return 30000;
  return 50000;
};


export default function ProductForm({ onSubmit = () => { }, onCancel = () => { }, product = {} }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [coins, setCoin] = useState('');

  useEffect(() => {

    const token = localStorage.getItem(NAME_CONFIG.TOKEN);
    if (!token) return;

    axios.get(`${API_ENDPOINTS.GET_USER_PROFILE}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        setCoin(res.data.user.coin);
      })
      .catch((err) => {
        console.error('Failed to fetch unique ID:', err);
      })

  }, [coins]);


  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    province: '',
    description: '',
    specifications: {},
    productStatus: '',
    price: undefined,
    originalPrice: undefined,
    address: '',
    mapUrl: '',
    images: [],
  });


  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(API_ENDPOINTS.GET_ALL_CATEGORY);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    async function fetchProvinces() {
      try {
        const response = await axios.get(API_ENDPOINTS.GET_ALL_PROVINCE);
        setProvinces(response.data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    }
    fetchCategories();
    fetchProvinces();
  }, []);

  const createProduct = async () => {
    try {
      const token = localStorage.getItem(NAME_CONFIG.TOKEN);
      if (!token) throw new Error('No token found');

      const category = categories.find(cat => cat.id === formData.categoryId || cat._id === formData.categoryId);
      const categoryId = category ? category.id || category._id : null;

      const province = provinces.find(p => p.id === formData.province || p._id === formData.province);
      const provinceId = province ? province.id || province._id : null;

      if (!categoryId || !provinceId) throw new Error('Invalid category or province');

      // Create FormData instance
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('categoryId', categoryId);
      formPayload.append('province', provinceId);
      formPayload.append('description', formData.description);
      formPayload.append('specifications', JSON.stringify(formData.specifications));
      formPayload.append('productStatus', formData.productStatus);
      formPayload.append('price', formData.price);
      formPayload.append('originalPrice', formData.originalPrice || '');
      formPayload.append('address', formData.address);
      formPayload.append('mapUrl', formData.mapUrl || '');

      // Append images (assuming formData.images contains File objects)
      formData.images.forEach((image) => {
        formPayload.append('images', image); // or use 'images[]' depending on backend
      });

      const response = await axios.post(API_ENDPOINTS.CREATE_POST, formPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // important!
        },
      });

      return response.data;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  };


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4); // max 4 images
    setFormData(prev => ({
      ...prev,
      images: files,
    }));
  };

  const [specifications, setSpecifications] = useState(
    product.specifications
      ? Object.entries(product.specifications).map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }]
  );

  const [errors, setErrors] = useState({});
  const [showAllErrors, setShowAllErrors] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
      if (errors[name]) setErrors({ ...errors, [name]: '' });
    } else if (type === 'number') {
      const numValue = value === '' ? undefined : parseFloat(value);
      setFormData({ ...formData, [name]: numValue });
      if (errors[name]) setErrors({ ...errors, [name]: '' });
    } else {
      setFormData({ ...formData, [name]: value });
      if (errors[name]) setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      categoryId: e.target.value,
    });
    if (errors.categoryId) setErrors({ ...errors, categoryId: '' });
  };

  const handleSpecKeyChange = (index, value) => {
    const newSpecs = [...specifications];
    newSpecs[index].key = value;
    setSpecifications(newSpecs);
    updateSpecificationsInFormData(newSpecs);
  };

  const handleSpecValueChange = (index, value) => {
    const newSpecs = [...specifications];
    newSpecs[index].value = value;
    setSpecifications(newSpecs);
    updateSpecificationsInFormData(newSpecs);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecification = (index) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs);
    updateSpecificationsInFormData(newSpecs);
  };

  const updateSpecificationsInFormData = (specs) => {
    const specsObject = {};
    specs.forEach((spec) => {
      if (spec.key.trim() && spec.value.trim()) {
        specsObject[spec.key.trim()] = spec.value.trim();
      }
    });
    setFormData({ ...formData, specifications: specsObject });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Phải có tên sản phẩm';
    else if (formData.name.length < 3) newErrors.name = 'Tên sản phẩm phải có ít nhất 3 ký tự.';

    if (!formData.price || formData.price <= 5000 || formData.price > 1000000000)
      newErrors.price = 'Giá phải từ 5.000 đến 1.000.000.000';

    if (formData.originalPrice && (formData.originalPrice <= 5000 || formData.originalPrice > 1000000000))
      newErrors.originalPrice = 'Giá gốc phải từ 5.000 and 1,000,000,000';


    if (!formData.categoryId) newErrors.categoryId = 'Hãy chọn phân loại sản phẩm';

    if (!formData.productStatus) newErrors.productStatus = 'Hãy chọn tình trạng sản phẩm';

    if (!formData.description?.trim()) newErrors.description = 'Phải có mô tả';
    else if (formData.description.length < 2)
      newErrors.description = 'Mô tả phải có ít nhất 2 ký tự';
    else if (formData.description.length > 600)
      newErrors.description = 'Mô tả phải có ít hơn 600 ký tự';
    if (!formData.province?.trim()) newErrors.province = 'Hãy chọn khu vực của bạn';

    setErrors(newErrors);
    setShowAllErrors(Object.keys(newErrors).length > 0);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const costedCoins = getPostCostByPrice(formData.price);
      if (coins < costedCoins) {
        alert(`Bạn không đủ xu để đăng bài. Cần ${costedCoins.toLocaleString('vi-VN')} xu.`);
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await createProduct();
        setSuccessMessage(result.message || 'Đăng sản phẩm thành công ✨');
        await Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: result.message || 'Đăng sản phẩm thành công ✨',
          timer: 1800,
          showConfirmButton: false,
        });
        navigate(-1); // go back
      } catch (error) {
        console.error('Failed to submit product:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };



  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };



  return (
    <Container className="product-form py-5">
      <Form onSubmit={handleSubmit}>
        {showAllErrors && Object.keys(errors).length > 0 && (
          <Alert variant="danger" className="error-alert mb-4">
            <div className="d-flex align-items-start">
              <AlertCircle className="me-2" size={20} />
              <div>
                <h3 className="error-title">Xin hãy chú ý:</h3>
                <ul className="error-list">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Alert>
        )}

        {/* Basic Information */}
        <Card className="form-section mb-4">
          <Card.Body className="p-4">
            <h2 className="section-title mb-4">Thông Tin Sản Phẩm</h2>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Tên Sản Phẩm *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder=""
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Giá Mong Muốn (vnd) * Số xu hiện tại: {coins}</Form.Label>
                  <Form.Control
                    type="text"
                    name="price"
                    value={formData.price !== undefined ? formData.price.toLocaleString('vi-VN') : ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\./g, '');
                      const num = parseInt(raw);
                      if (!isNaN(num) || raw === '') {
                        handleInputChange({ target: { name: 'price', value: raw, type: 'number' } });
                      }
                    }}
                    placeholder="vd: 99.000"
                    isInvalid={!!errors.price}
                  />
                  <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                  {/* Coin cost display based on price range */}
                  {formData.price && (
                    <div className="mt-2 text-info small">
                      Phí đăng bài dự kiến:{" "}
                      <strong>
                        {
                          formData.price < 500000 ? "5.000 xu" :
                            formData.price <= 1000000 ? "15.000 xu" :
                              formData.price <= 5000000 ? "30.000 xu" :
                                "50.000 xu"
                        }
                      </strong>
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Giá Gốc Sản Phẩm (không bắt buộc) *</Form.Label>
                  <Form.Control
                    type="text"
                    name="originalPrice"
                    value={formData.originalPrice !== undefined ? formData.originalPrice.toLocaleString('vi-VN') : ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\./g, '');
                      const num = parseInt(raw);
                      if (!isNaN(num) || raw === '') {
                        handleInputChange({ target: { name: 'originalPrice', value: raw, type: 'number' } });
                      }
                    }}
                    placeholder="vd: 199.000"
                    isInvalid={!!errors.originalPrice}
                  />
                  <Form.Control.Feedback type="invalid">{errors.originalPrice}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Danh Mục *</Form.Label>
                  <Form.Select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleCategoryChange}
                    isInvalid={!!errors.categoryId}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Hiện Trạng *</Form.Label>
                  <Form.Select
                    name="productStatus"
                    value={formData.productStatus}
                    onChange={handleInputChange}
                    isInvalid={!!errors.productStatus}
                  >
                    <option value="">Chọn hiện trạng</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.productStatus}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Địa Điểm *</Form.Label>
                  <Form.Select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province._id}>
                        {province.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.province}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Địa Chỉ *</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ"
                    isInvalid={!!errors.address}
                  />
                  <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Form.Group>
          <Form.Label>
            Đăng Ảnh <span className="optional-text">(có thể đăng tới 4 ảnh)</span>
          </Form.Label>

          <div
            className="dropzone d-flex flex-column align-items-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
              const newFiles = droppedFiles.slice(0, 4 - formData.images.length);
              setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newFiles],
              }));
            }}
            onClick={() => document.getElementById('image-upload').click()}
          >
            <p className="mb-2">Kéo và thả hình ảnh vào đây hoặc nhấn để chọn</p>

            <Form.Control
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleImageChange}
              isInvalid={!!errors.images}
            />

            <div className="d-flex gap-3 flex-wrap justify-content-center mt-2 w-100">
              {formData.images?.map((file, i) => (
                <div key={i} className="position-relative" style={{ height: 100 }}>
                  <img
                    src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                    alt={`Preview ${i}`}
                    style={{ height: '100%', width: 'auto', borderRadius: 4 }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(i);
                    }}
                    className="btn-orange position-absolute top-0 end-0"
                    style={{ transform: 'translate(50%, -50%)' }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

          </div>

          <Form.Control.Feedback type="invalid">
            {errors.images}
          </Form.Control.Feedback>
        </Form.Group>


        {/* Description */}
        <Card className="form-section mb-4">
          <Card.Body className="p-4">
            <h2 className="section-title mb-4">Mô Tả Sản Phẩm</h2>
            <Form.Group>
              <Form.Label>Mô Tả *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of your product including its features, condition, and any defects or issues."
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Specifications */}
        <Card className="form-section mb-4">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="section-title">
                Đặc Tả <span className="optional-text">(Không bắt buộc)</span>
              </h2>
              <Button variant="outline-primary" size="sm" onClick={addSpecification}>
                Thêm Dòng Đặc Tả
              </Button>
            </div>
            {specifications.map((spec, index) => (
              <Row key={index} className="g-2 mb-2 align-items-center">
                <Col xs={5}>
                  <Form.Control
                    type="text"
                    value={spec.key}
                    onChange={(e) => handleSpecKeyChange(index, e.target.value)}
                    placeholder="vd: Màu, chất liệu, dung lượng, ..."
                  />
                </Col>
                <Col xs={5}>
                  <Form.Control
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecValueChange(index, e.target.value)}
                    placeholder="Đỏ, nhựa nhám, 64G, ..."
                  />
                </Col>
                <Col xs={2} className="d-flex align-items-center">
                  <Button
                    variant="link"
                    className="remove-spec-btn"
                    onClick={() => removeSpecification(index)}
                  >
                    <X size={18} />
                  </Button>
                </Col>
              </Row>
            ))}
          </Card.Body>
        </Card>

        {/* Form Actions */}
        <div className="d-flex justify-content-end gap-3">

          <Button variant="outline-secondary" onClick={onCancel}>
            Hủy
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Vui lòng đợi...' : 'Thêm Sản Phẩm'}
          </Button>

        </div>
      </Form>
    </Container>
  );
}
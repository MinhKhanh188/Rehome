// front-end/src/components/pages/dashboard/ProductForm.js
import axios from 'axios';
import { AlertCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';
import '../../css/ProductForm.css';

const conditions = ['Mới', 'Like-new', 'Cũ'];
export default function ProductForm({ onSubmit = () => { }, onCancel = () => { }, product = {} }) {

  const [categories, setCategories] = useState([]);
  const [provinces, setProvinces] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    province: '',
    description: '',
    productStatus: '',
    price: undefined,
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
      formPayload.append('productStatus', formData.productStatus);
      formPayload.append('price', formData.price);
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


  // Replace handleImageChange with this
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // max 5 images
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
    if (!formData.name?.trim()) newErrors.name = 'Product name is required';
    else if (formData.title.length < 1) newErrors.title = 'Title must be at least 10 characters';

    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than zero';

    if (!formData.categoryId) newErrors.categoryId = 'Category is required';

    if (!formData.condition) newErrors.condition = 'Condition is required';

    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    else if (formData.description.length < 2)
      newErrors.description = 'Description must be at least 20 characters';

    if (!formData.province?.trim()) newErrors.province = 'Province is required';

    setErrors(newErrors);
    setShowAllErrors(Object.keys(newErrors).length > 0);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const result = await createProduct();
        onSubmit(result);
      } catch (error) {
        console.error('Failed to submit product:', error);
      }
    }
  };


  return (
    <Container className="product-form py-5">
      <Form onSubmit={handleSubmit}>
        {showAllErrors && Object.keys(errors).length > 0 && (
          <Alert variant="danger" className="error-alert mb-4">
            <div className="d-flex align-items-start">
              <AlertCircle className="me-2" size={20} />
              <div>
                <h3 className="error-title">Please fix the following errors:</h3>
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
                  <Form.Label>Giá Mong Muốn (vnd) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    value={formData.price === undefined ? '' : formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 499.99"
                    isInvalid={!!errors.price}
                  />
                  <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
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

        {/* Image Upload */}
        <Form.Group>
          <Form.Label>Product Images <span className="optional-text">(Optional, up to 5)</span></Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            isInvalid={!!errors.images}
          />
          <Form.Control.Feedback type="invalid">{errors.images}</Form.Control.Feedback>

          <div className="d-flex gap-2 flex-wrap mt-2">
            {formData.images?.map((file, i) => (
              <img
                key={i}
                src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                alt={`Preview ${i}`}
                style={{ maxHeight: 100 }}
              />
            ))}
          </div>
        </Form.Group>



        {/* Description */}
        <Card className="form-section mb-4">
          <Card.Body className="p-4">
            <h2 className="section-title mb-4">Product Description</h2>
            <Form.Group>
              <Form.Label>Description *</Form.Label>
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
                Specifications <span className="optional-text">(Optional)</span>
              </h2>
              <Button variant="outline-primary" size="sm" onClick={addSpecification}>
                Add Specification
              </Button>
            </div>
            {specifications.map((spec, index) => (
              <Row key={index} className="g-2 mb-2 align-items-center">
                <Col xs={5}>
                  <Form.Control
                    type="text"
                    value={spec.key}
                    onChange={(e) => handleSpecKeyChange(index, e.target.value)}
                    placeholder="e.g. Storage, Color, etc."
                  />
                </Col>
                <Col xs={5}>
                  <Form.Control
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecValueChange(index, e.target.value)}
                    placeholder="e.g. 256GB, Blue, etc."
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
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {product.id === '0' ? 'Add Product' : 'Update Product'}
          </Button>
        </div>
      </Form>
    </Container>
  );
}
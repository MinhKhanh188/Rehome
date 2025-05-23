import React, { useState } from 'react';
import { Container, Form, Card, Row, Col, Button, Alert } from 'react-bootstrap';
import { X, AlertCircle } from 'lucide-react';
import ImageUploader from './ImageUploader';
import '../css/ProductForm.css';

// Placeholder data for categories and conditions
const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'clothing', name: 'Clothing' },
];

const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

// Placeholder product data (optional, for editing)
const defaultProduct = {
  id: '0',
  title: '',
  price: 0,
  originalPrice: undefined,
  description: '',
  condition: '',
  imageUrl: '',
  additionalImages: [],
  category: '',
  categorySlug: '',
  specifications: {},
  isAvailable: true,
  location: '',
  sellerName: '',
  sellerRating: 0,
  listedDate: '',
};

export default function ProductForm({ product = defaultProduct, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    id: product.id,
    title: product.title,
    price: product.price,
    originalPrice: product.originalPrice,
    description: product.description,
    condition: product.condition,
    imageUrl: product.imageUrl,
    additionalImages: product.additionalImages,
    category: product.category,
    categorySlug: product.categorySlug,
    specifications: product.specifications,
    isAvailable: product.isAvailable,
    location: product.location,
    sellerName: product.sellerName,
    sellerRating: product.sellerRating,
    listedDate: product.listedDate,
  });

  const [specifications, setSpecifications] = useState(
    Object.entries(product.specifications || {}).map(([key, value]) => ({ key, value })) || [
      { key: '', value: '' },
    ]
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
    const selectedCategory = categories.find((cat) => cat.name === e.target.value);
    if (selectedCategory) {
      setFormData({
        ...formData,
        category: selectedCategory.name,
        categorySlug: selectedCategory.id,
      });
      if (errors.category) setErrors({ ...errors, category: '' });
    }
  };

  const handleMainImageUpload = (imageUrl) => {
    setFormData({ ...formData, imageUrl });
    if (errors.imageUrl) setErrors({ ...errors, imageUrl: '' });
  };

  const handleAdditionalImagesUpload = (imageUrls) => {
    setFormData({ ...formData, additionalImages: imageUrls });
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
    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    else if (formData.title.length < 10) newErrors.title = 'Title must be at least 10 characters';

    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than zero';

    if (!formData.category) newErrors.category = 'Category is required';

    if (!formData.condition) newErrors.condition = 'Condition is required';

    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    else if (formData.description.length < 20)
      newErrors.description = 'Description must be at least 20 characters';

    if (!formData.imageUrl) newErrors.imageUrl = 'Main product image is required';

    if (!formData.location?.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    setShowAllErrors(Object.keys(newErrors).length > 0);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
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
            <h2 className="section-title mb-4">Basic Information</h2>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Product Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. iPhone 13 Pro - 256GB - Excellent Condition"
                    isInvalid={!!errors.title}
                  />
                  <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Price ($) *</Form.Label>
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
                  <Form.Label>Original Price ($) <span className="optional-text">(Optional)</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="originalPrice"
                    step="0.01"
                    min="0"
                    value={formData.originalPrice === undefined ? '' : formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="e.g. 599.99"
                  />
                  <Form.Text className="optional-text">
                    Include if you're offering a discount from the original price
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    isInvalid={!!errors.category}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Condition *</Form.Label>
                  <Form.Select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    isInvalid={!!errors.condition}
                  >
                    <option value="">Select condition</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.condition}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Location *</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. San Francisco, CA"
                    isInvalid={!!errors.location}
                  />
                  <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Check
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  label="List as active and available for purchase"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Product Images */}
        <Card className="form-section mb-4">
          <Card.Body className="p-4">
            <h2 className="section-title mb-4">Product Images</h2>
            <Form.Group className="mb-4">
              <Form.Label>Main Product Image *</Form.Label>
              <ImageUploader
                imageUrl={formData.imageUrl}
                onImageUploaded={handleMainImageUpload}
                isSingleImage
              />
              {errors.imageUrl && <div className="invalid-feedback">{errors.imageUrl}</div>}
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Additional Images <span className="optional-text">(Optional, up to 4)</span>
              </Form.Label>
              <ImageUploader
                imageUrls={formData.additionalImages}
                onImagesUploaded={handleAdditionalImagesUpload}
                maxImages={4}
              />
            </Form.Group>
          </Card.Body>
        </Card>

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
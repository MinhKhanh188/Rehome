import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, InputGroup, Pagination, Badge } from 'react-bootstrap';
import '../css/Products.css';
import { ProductCard } from './ProductCard';
import { NavbarComponent } from './Navbar';

// Thêm mock data ở đầu file (trước hoặc sau import)
const mockProducts = [
  {
    id: 1,
    name: 'iPhone 13 Pro 256GB - Graphite',
    price: 799.99,
    condition: 'Like New',
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1630691711598-5c9f4f37f4e6',
      'https://images.unsplash.com/photo-1642053551054-8d60215e1518'
    ],
    isVip: true,
    createdAt: '2024-05-01T10:00:00Z'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S22 Ultra',
    price: 699.99,
    condition: 'Excellent',
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1642053551054-8d60215e1518'
    ],
    isVip: false,
    createdAt: '2024-05-10T12:00:00Z'
  },
  {
    id: 3,
    name: 'Modern Sofa',
    price: 350,
    condition: 'Good',
    category: 'furniture',
    images: [
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4'
    ],
    isVip: false,
    createdAt: '2024-05-15T09:00:00Z'
  },
  {
    id: 4,
    name: 'Office Desk',
    price: 120,
    condition: 'Fair',
    category: 'office',
    images: [
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2'
    ],
    isVip: false,
    createdAt: '2024-05-12T14:00:00Z'
  },
  {
    id: 5,
    name: 'Kitchen Blender',
    price: 45,
    condition: 'Like New',
    category: 'kitchen',
    images: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
    ],
    isVip: false,
    createdAt: '2024-05-18T11:00:00Z'
  }
  // Thêm sản phẩm nếu muốn
];

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Thay đổi khởi tạo state products:
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filter states
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('newest');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Placeholder for categories and conditions (replace with actual data)
  const categories = [
    { id: 'electronics', name: 'Electronics', icon: '💻' },
    { id: 'appliances', name: 'Appliances', icon: '🧺' },
    { id: 'furniture', name: 'Furniture', icon: '🛋️' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
    { id: 'decor', name: 'Home Decor', icon: '🏠' },
    { id: 'garden', name: 'Garden', icon: '🌻' },
    { id: 'lighting', name: 'Lighting', icon: '💡' },
    { id: 'office', name: 'Office', icon: '🖊️' }
    // Add more as needed
  ];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  // Initialize filters from URL params
  useEffect(() => {
    const query = searchParams.get('q');
    const categoryParam = searchParams.get('category');
    const conditionParam = searchParams.get('condition');
    const sort = searchParams.get('sort');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    if (query) setSearchValue(query);
    if (categoryParam) setSelectedCategories(categoryParam.split(','));
    if (conditionParam) setSelectedConditions(conditionParam.split(','));
    if (sort) setSortBy(sort);
    if (minPrice && maxPrice) setPriceRange([Number(minPrice), Number(maxPrice)]);

    // Apply filters (replace with actual filtering logic)
    applyFilters();
  }, [searchParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  // Update URL when filters change
  const updateURL = () => {
    const params = {};
    if (searchValue) params.q = searchValue;
    if (selectedCategories.length) params.category = selectedCategories.join(',');
    if (selectedConditions.length) params.condition = selectedConditions.join(',');
    if (priceRange[0] > 0 || priceRange[1] < 5000) {
      params.minPrice = priceRange[0].toString();
      params.maxPrice = priceRange[1].toString();
    }
    if (sortBy) params.sort = sortBy;
    setSearchParams(params);
  };

  // Placeholder filter logic (replace with actual implementation)
  const applyFilters = (
    categories = selectedCategories,
    conditions = selectedConditions,
    price = priceRange,
    search = searchValue,
    sort = sortBy
  ) => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (categories.length) {
      filtered = filtered.filter(p => categories.includes(p.category));
    }
    if (conditions.length) {
      filtered = filtered.filter(p => conditions.includes(p.condition));
    }
    filtered = filtered.filter(p => p.price >= price[0] && p.price <= price[1]);

    if (sort === 'priceAsc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'priceDesc') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = () => {
    updateURL();
    applyFilters();
  };

  const handleCategoryChange = (categoryId, checked) => {
    const updatedCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter(id => id !== categoryId);

    setSelectedCategories(updatedCategories);

    // Cập nhật URL và áp dụng filter ngay lập tức
    const params = {
      ...Object.fromEntries(searchParams.entries()),
      category: updatedCategories.join(','),
    };
    if (!updatedCategories.length) delete params.category; // Xóa param nếu không có category nào
    setSearchParams(params);

    // Áp dụng filter
    applyFilters(updatedCategories, selectedConditions, priceRange, searchValue, sortBy);
  };

  const handleConditionChange = (condition, checked) => {
    const updatedConditions = checked
      ? [...selectedConditions, condition]
      : selectedConditions.filter(c => c !== condition);

    setSelectedConditions(updatedConditions);

    // Cập nhật URL và áp dụng filter ngay lập tức
    const params = {
      ...Object.fromEntries(searchParams.entries()),
      condition: updatedConditions.join(','),
    };
    if (!updatedConditions.length) delete params.condition; // Xóa param nếu không có condition nào
    setSearchParams(params);

    // Áp dụng filter
    applyFilters(selectedCategories, updatedConditions, priceRange, searchValue, sortBy);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newRange = [...priceRange];
    if (name === 'minPrice') newRange[0] = Number(value);
    else newRange[1] = Number(value);

    setPriceRange(newRange);

    // Cập nhật URL và áp dụng filter ngay lập tức
    const params = {
      ...Object.fromEntries(searchParams.entries()),
      minPrice: newRange[0].toString(),
      maxPrice: newRange[1].toString(),
    };
    if (newRange[0] === 0 && newRange[1] === 5000) {
      delete params.minPrice;
      delete params.maxPrice;
    }
    setSearchParams(params);

    // Áp dụng filter
    applyFilters(selectedCategories, selectedConditions, newRange, searchValue, sortBy);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    updateURL();
    applyFilters();
  };

  const handleClearFilters = () => {
    setSearchValue('');
    setSelectedCategories([]);
    setSelectedConditions([]);
    setPriceRange([0, 5000]);
    setSortBy('newest');
    setSearchParams({});
    applyFilters();
  };

  const handleProductClick = (productId) => {
    navigate(`/products/product-details/?id=${productId}`);
  };

  // Pagination
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
        <NavbarComponent/>
        <Container className="products-container py-5 px-4">
      <h1 className="products-title mb-4">Find Quality Secondhand Products</h1>

      <Row className="g-4">
        {/* Filters Sidebar */}
        <Col lg={3}>
          <Card className="filters-card shadow-sm p-4">
            <div className="mb-4">
              <h2 className="filter-heading mb-3">Search</h2>
              <InputGroup>
                <Form.Control
                  placeholder="Search products..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} className='btn-primary'>Search</Button>
              </InputGroup>
            </div>

            <hr className="my-4" />

            <div className="mb-4">
              <h2 className="filter-heading mb-3">Categories</h2>
              {categories.map((category) => (
                <Form.Check
                  key={category.id}
                  id={`category-${category.id}`}
                  label={(category.icon) + ' ' + category.name}
                  checked={selectedCategories.includes(category.id)}
                  onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                  className="mb-2"
                />
              ))}
            </div>

            <hr className="my-4" />

            <div className="mb-4">
              <h2 className="filter-heading mb-3">Condition</h2>
              {conditions.map((condition) => (
                <Form.Check
                  key={condition}
                  id={`condition-${condition}`}
                  label={condition}
                  checked={selectedConditions.includes(condition)}
                  onChange={(e) => handleConditionChange(condition, e.target.checked)}
                  className="mb-2"
                />
              ))}
            </div>

            <hr className="my-4" />

            <div className="mb-4">
              <h2 className="filter-heading mb-3">Price Range</h2>
              <div className="d-flex gap-3">
                <Form.Control
                  type="number"
                  name="minPrice"
                  value={priceRange[0]}
                  onChange={handlePriceChange}
                  placeholder="Min"
                  min="0"
                  max="5000"
                />
                <Form.Control
                  type="number"
                  name="maxPrice"
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  placeholder="Max"
                  min="0"
                  max="5000"
                />
              </div>
            </div>

            <hr className="my-4" />

            <Button className="btn-primary w-100" onClick={handleClearFilters}>
              Clear All Filters
            </Button>
          </Card>
        </Col>

        {/* Product Grid */}
        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="products-count">
              {filteredProducts.length} products found
            </span>
            <Form.Group>
              <Form.Label className="me-2">Sort by:</Form.Label>
              <Form.Select value={sortBy} onChange={handleSortChange}>
                <option value="newest">Newest First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </Form.Select>
            </Form.Group>
          </div>

          {/* Active Filters */}
          {(searchValue || selectedCategories.length || selectedConditions.length || priceRange[0] > 0 || priceRange[1] < 5000) && (
            <div className="d-flex flex-wrap gap-2 mb-4">
              {searchValue && (
                <Badge bg="secondary" className="filter-badge">
                  Search: {searchValue}
                  <Button
                    variant="link"
                    className="badge-close"
                    onClick={() => {
                      setSearchValue('');
                      updateURL();
                      applyFilters();
                    }}
                  >
                    ✕
                  </Button>
                </Badge>
              )}
              {selectedCategories.map((categoryId) => {
                const category = categories.find((c) => c.id === categoryId);
                return (
                  <Badge key={categoryId} bg="secondary" className="filter-badge">
                    {category?.name}
                    <Button
                      variant="link"
                      className="badge-close"
                      onClick={() => handleCategoryChange(categoryId, false)}
                    >
                      ✕
                    </Button>
                  </Badge>
                );
              })}
              {selectedConditions.map((condition) => (
                <Badge key={condition} bg="secondary" className="filter-badge">
                  {condition}
                  <Button
                    variant="link"
                    className="badge-close"
                    onClick={() => handleConditionChange(condition, false)}
                  >
                    ✕
                  </Button>
                </Badge>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                <Badge bg="secondary" className="filter-badge">
                  ${priceRange[0]} - ${priceRange[1]}
                </Badge>
              )}
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <Card className="no-products-card p-5 text-center">
              <Card.Title>No products found</Card.Title>
              <Card.Text>Try adjusting your search or filter criteria</Card.Text>
              <Button onClick={handleClearFilters} >
                Clear all filters
              </Button>
            </Card>
            
          ) : (
            <Row className="g-4">
              {paginatedProducts.map((product) => (
                <Col md={6} lg={4} key={product.id}>
                  <div
                    className="product-card-wrapper"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <ProductCard
                      id={product.id}
                      title={product.name}
                      price={product.price}
                      condition={product.condition}
                      imageUrl={product.images ? product.images[0] : ''}
                      isVip={product.isVip}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <Pagination className="mt-5 justify-content-center">
              <Pagination.Prev
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              />
              {[...Array(pageCount)].map((_, index) => {
                const pageNum = index + 1;
                if (
                  pageCount <= 5 ||
                  pageNum === 1 ||
                  pageNum === pageCount ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <Pagination.Item
                      key={index}
                      active={currentPage === pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Pagination.Item>
                  );
                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <Pagination.Ellipsis key={`ellipsis-${pageNum}`} />;
                }
                return null;
              })}
              <Pagination.Next
                onClick={() => setCurrentPage((prev) => Math.min(pageCount, prev + 1))}
                disabled={currentPage === pageCount}
              />
            </Pagination>
          )}
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Products;
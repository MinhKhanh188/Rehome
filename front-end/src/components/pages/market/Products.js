// front-end/src/components/pages/market/Products.js
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, InputGroup, Pagination, Badge } from 'react-bootstrap';
import '../../css/Products.css';
import { ProductCard } from '../layout/ProductCard';
import { NavbarComponent } from '../layout/Navbar';
import { API_ENDPOINTS } from '../../../config';


const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Thay đổi khởi tạo state products:
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filter states
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('newest');
  // Thêm state cho search tỉnh thành
  const [province, setProvince] = useState('');
  const [provinceInput, setProvinceInput] = useState('');
  const [loading, setLoading] = useState(true);


  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Placeholder for categories and conditions (replace with actual data)
  const categories = [
    { id: 'electronics', name: 'Thiết Bị Điện Tử', icon: '💻' },
    { id: 'men-fashion', name: 'Thời Trang Nam', icon: '👔' },
    { id: 'women-fashion', name: 'Thời Trang Nữ', icon: '👗' },
    { id: 'men-accessories', name: 'Phụ Kiện Nam', icon: '🕶️' },
    { id: 'women-accessories', name: 'Phụ Kiện Nữ', icon: '👝' },
    { id: 'phones', name: 'Điện Thoại & Phụ Kiện', icon: '📱' },
    { id: 'home-appliances', name: 'Thiết Bị Điện Gia Dụng', icon: '🔌' },
    { id: 'household', name: 'Đồ Gia Dụng', icon: '🧺' },
    { id: 'personal-items', name: 'Đồ Dùng Cá Nhân', icon: '🧴' },
    { id: 'cosmetics', name: 'Mỹ Phẩm', icon: '💄' },
    { id: 'furniture', name: 'Nội Thất', icon: '🛋️' },
    { id: 'sports', name: 'Dụng Cụ Thể Thao', icon: '🏀' },
    { id: 'education', name: 'Giáo Dục', icon: '📚' }
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  useEffect(() => {
    const fetchProductsByProvince = async () => {
      const provinceParam = searchParams.get('province');
      if (!provinceParam) return; // avoid calling API with empty province

      try {
        const response = await fetch(`${API_ENDPOINTS.GET_POST_BY_PROVINCE}?province=${encodeURIComponent(provinceParam)}`);
        const data = await response.json();
        setProducts(data);
        applyFilters(
          selectedCategories,
          selectedConditions,
          priceRange,
          searchValue,
          sortBy,
          provinceParam,
          data
        );
        setLoading(false);
        console.log('Fetched products:', data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProductsByProvince();
  }, [searchParams]); // 💡 depend on searchParams



  useEffect(() => {
    const query = searchParams.get('q');
    const categoryParam = searchParams.get('category');
    const conditionParam = searchParams.get('condition');
    const sort = searchParams.get('sort');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const provinceParam = searchParams.get('province');

    if (query) setSearchValue(query);
    if (categoryParam) setSelectedCategories(categoryParam.split(','));
    if (conditionParam) setSelectedConditions(conditionParam.split(','));
    if (sort) setSortBy(sort);
    if (minPrice && maxPrice) setPriceRange([Number(minPrice), Number(maxPrice)]);
    if (provinceParam) setProvince(provinceParam);

    // ✅ Always use the most recent `products` data
    applyFilters(
      categoryParam ? categoryParam.split(',') : [],
      conditionParam ? conditionParam.split(',') : [],
      [Number(minPrice || 0), Number(maxPrice || 5000)],
      query || '',
      sort || 'newest',
      provinceParam || '',
      products // ✅ ensure correct data is used
    );
  }, [searchParams, products]); // 🔁 add products as a dependency


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
    sort = sortBy,
    productList = products
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
    applyFilters(updatedCategories, selectedConditions, priceRange, searchValue, sortBy, province);
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
    applyFilters(selectedCategories, updatedConditions, priceRange, searchValue, sortBy, province);
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
    applyFilters(selectedCategories, selectedConditions, newRange, searchValue, sortBy, province);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    // Cập nhật URL và áp dụng filter ngay lập tức với giá trị mới
    const params = {
      ...Object.fromEntries(searchParams.entries()),
      sort: newSort,
    };
    setSearchParams(params);
    applyFilters(selectedCategories, selectedConditions, priceRange, searchValue, newSort, province);
  };

  const handleClearFilters = () => {
    setSearchValue('');
    setSelectedCategories([]);
    setSelectedConditions([]);
    setPriceRange([0, 5000]);
    setSortBy('newest');
    setProvince('');
    setProvinceInput('');
    setSearchParams({});
    applyFilters();
  };

  const handleClearSearch = () => {
    setSearchValue('');
    const params = { ...Object.fromEntries(searchParams.entries()) };
    delete params.q;
    setSearchParams(params);
    applyFilters(selectedCategories, selectedConditions, priceRange, '', sortBy, province);
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
      <NavbarComponent />
      <Container className="products-container py-5 px-4">
        <h1 className="products-title mb-4">Các Đồ Second Hand Trong Khu Vực {province}</h1>
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
                <h2 className="filter-heading mb-3">Danh Mục</h2>
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
                <h2 className="filter-heading mb-3">Hiện Trạng</h2>
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
                <h2 className="filter-heading mb-3">Tầm Giá</h2>
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


              <Button className="btn-primary w-100" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            </Card>
          </Col>

          {/* Product Grid */}
          <Col lg={9}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="products-count">
                {filteredProducts.length} sản phẩn được tìm thấy
              </span>
              <Form.Group>
                <Form.Label className="me-2">Sắp xếp theo:</Form.Label>
                <Form.Select value={sortBy} onChange={handleSortChange}>
                  <option value="newest">Mới nhất</option>
                  <option value="priceAsc">Giá: Thấp tới cao</option>
                  <option value="priceDesc">Giá: Cao tới thấp</option>
                </Form.Select>
              </Form.Group>
            </div>

            {/* Active Filters */}
            {(searchValue || selectedCategories.length || selectedConditions.length || priceRange[0] > 0 || priceRange[1] < 5000 || province) && (
              <div className="d-flex flex-wrap gap-2 mb-4">
                {searchValue && (
                  <Badge bg="secondary" className="filter-badge">
                    Search: {searchValue}
                    <Button
                      variant="link"
                      className="badge-close"
                      onClick={handleClearSearch}
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
            {paginatedProducts.length === 0 ? null : (
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
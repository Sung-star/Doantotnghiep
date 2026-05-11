import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import ProductCard from "./ProductCard";
import { 
  FaFilter, FaSortAmountDown, FaSortAmountUp, 
  FaList, FaTh, FaSearch, FaTimes, FaChevronRight, FaBoxOpen 
} from 'react-icons/fa';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryNameFromUrl = searchParams.get('category');
  const queryFromUrl = searchParams.get('q') || searchParams.get('search') || '';

  useEffect(() => {
    if (queryFromUrl) setSearchQuery(queryFromUrl);
    fetchData();
  }, [queryFromUrl]);

  useEffect(() => {
    if (categories.length > 0 && categoryNameFromUrl) {
      const matchedCategory = categories.find(c => c.name.toLowerCase() === categoryNameFromUrl.toLowerCase());
      if (matchedCategory) setSelectedCategories([matchedCategory.id]);
    } else if (!categoryNameFromUrl) {
      setSelectedCategories([]);
    }
  }, [categoryNameFromUrl, categories]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, sortBy, priceRange, selectedCategories, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let url = `/products?size=1000`;
      const [productsRes, categoriesRes] = await Promise.all([
        api.get(url),
        api.get('/categories')
      ]);
      const data = productsRes.data.content || productsRes.data;
      setProducts(Array.isArray(data) ? data : []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let result = [...products];
    if (selectedCategories.length > 0) {
      result = result.filter(p => p.categories?.some(cat => selectedCategories.includes(cat.id)));
    }
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)); break;
      default: break;
    }
    setFilteredProducts(result);
    setCurrentPage(1);
  };

  const paginate = (num) => {
    setCurrentPage(num);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-white">
      <div className="spinner-border text-primary"></div>
    </div>
  );

  return (
    <div className="product-list-wrapper bg-white py-5" style={{ fontFamily: '"Inter", sans-serif' }}>
      <div className="container-fluid px-md-5">
        {/* Header Section */}
        <div className="row mb-5 align-items-end">
          <div className="col-md-7">
            <nav className="mb-2 small fw-bold text-uppercase tracking-widest text-muted">
              <Link to="/" className="text-decoration-none text-muted">Trang chủ</Link>
              <FaChevronRight className="mx-2" size={8} />
              <span className="text-dark">Sản phẩm</span>
            </nav>
            <h1 className="display-4 fw-black text-uppercase italic tracking-tighter mb-0">Bộ sưu tập <span className="text-gradient">2026</span></h1>
            <p className="text-muted mb-0 mt-2">Khám phá {filteredProducts.length} phong cách đẳng cấp dành cho bạn.</p>
          </div>
          <div className="col-md-5 d-flex justify-content-md-end gap-3 mt-4 mt-md-0">
            <div className="btn-group shadow-sm rounded-pill overflow-hidden">
                <button className={`btn px-4 ${viewMode === 'grid' ? 'btn-dark' : 'btn-light border'}`} onClick={() => setViewMode('grid')}><FaTh /></button>
                <button className={`btn px-4 ${viewMode === 'list' ? 'btn-dark' : 'btn-light border'}`} onClick={() => setViewMode('list')}><FaList /></button>
            </div>
            <button className="btn btn-dark rounded-pill px-4 fw-black d-lg-none" onClick={() => setShowFilters(true)}>
                <FaFilter className="me-2"/> BỘ LỌC
            </button>
          </div>
        </div>

        <div className="row g-5">
          {/* Sidebar Filters */}
          <div className={`col-lg-3 ${showFilters ? 'd-block' : 'd-none d-lg-block'}`}>
            <div className="sticky-top" style={{ top: '100px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-black text-uppercase tracking-widest m-0">Lọc theo</h5>
                    {showFilters && <button className="btn-close d-lg-none" onClick={() => setShowFilters(false)}></button>}
                </div>
                
                {/* Search */}
                <div className="mb-5">
                    <div className="input-group search-group-luxury">
                        <span className="input-group-text border-0 bg-transparent ps-3"><FaSearch size={14} className="text-muted" /></span>
                        <input type="text" className="form-control border-0 shadow-none bg-transparent ps-2 small" 
                               placeholder="Tìm sản phẩm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-5 pb-2">
                    <h6 className="fw-black text-uppercase small tracking-widest mb-3 border-bottom pb-2">Danh mục</h6>
                    <div className="d-flex flex-column gap-2">
                        {categories.map(c => (
                            <div key={c.id} className="form-check custom-check">
                                <input className="form-check-input" type="checkbox" checked={selectedCategories.includes(c.id)} 
                                       onChange={() => setSelectedCategories(prev => prev.includes(c.id) ? prev.filter(i => i !== c.id) : [...prev, c.id])} id={`cat-${c.id}`} />
                                <label className="form-check-label small fw-bold text-muted cursor-pointer" htmlFor={`cat-${c.id}`}>{c.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price */}
                <div className="mb-5 pb-2">
                    <h6 className="fw-black text-uppercase small tracking-widest mb-3 border-bottom pb-2">Khoảng giá</h6>
                    <input type="range" className="form-range" min="0" max="10000000" step="100000" value={priceRange[1]} 
                           onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} />
                    <div className="d-flex justify-content-between mt-2 font-weight-bold small text-dark">
                        <span>0đ</span>
                        <span>{priceRange[1].toLocaleString()}đ</span>
                    </div>
                </div>

                {/* Sort */}
                <div className="mb-5">
                    <h6 className="fw-black text-uppercase small tracking-widest mb-3 border-bottom pb-2">Sắp xếp</h6>
                    <select className="form-select border-0 bg-light rounded-3 fw-bold small py-2" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Mới nhất</option>
                        <option value="price-low">Giá: Thấp - Cao</option>
                        <option value="price-high">Giá: Cao - Thấp</option>
                        <option value="name">Tên: A - Z</option>
                    </select>
                </div>

                <button className="btn btn-link text-danger text-uppercase small fw-black text-decoration-none p-0 w-100 text-start" 
                        onClick={() => { setSelectedCategories([]); setPriceRange([0, 10000000]); setSortBy('newest'); setSearchQuery(''); }}>
                    LÀM MỚI BỘ LỌC
                </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="col-lg-9">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-5 rounded-5 bg-light">
                <FaBoxOpen size={60} className="text-muted mb-4 opacity-25" />
                <h4 className="fw-black text-uppercase">Không tìm thấy sản phẩm</h4>
                <p className="text-muted">Hãy thử thay đổi tiêu chí lọc hoặc từ khóa tìm kiếm.</p>
              </div>
            ) : (
              <>
                <div className={`row g-4 ${viewMode === 'grid' ? 'row-cols-1 row-cols-md-2 row-cols-lg-3' : 'row-cols-1'}`}>
                  {filteredProducts.slice((currentPage-1)*productsPerPage, currentPage*productsPerPage).map(p => (
                    <div key={p.id} className="col mb-4">
                      <ProductCard product={p} viewMode={viewMode} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {Math.ceil(filteredProducts.length / productsPerPage) > 1 && (
                  <nav className="mt-5 pt-4">
                    <ul className="pagination justify-content-center gap-2">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link rounded-circle border-0 bg-light text-dark font-weight-bold" onClick={() => paginate(currentPage - 1)}>
                            <FaSortAmountUp style={{transform: 'rotate(-90deg)'}} />
                        </button>
                      </li>
                      {[...Array(Math.ceil(filteredProducts.length / productsPerPage))].map((_, i) => (
                        <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                          <button className={`page-link rounded-circle border-0 font-weight-bold mx-1 ${currentPage === i+1 ? 'bg-dark text-white' : 'bg-light text-dark'}`} 
                                  onClick={() => paginate(i + 1)} style={{ width: '40px', height: '40px' }}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === Math.ceil(filteredProducts.length / productsPerPage) ? 'disabled' : ''}`}>
                        <button className="page-link rounded-circle border-0 bg-light text-dark font-weight-bold" onClick={() => paginate(currentPage + 1)}>
                             <FaSortAmountUp style={{transform: 'rotate(90deg)'}} />
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
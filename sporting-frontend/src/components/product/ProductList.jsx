import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axiosConfig';
import ProductCard from "./ProductCard";
import { 
  FaFilter, FaSortAmountDown, FaSortAmountUp, 
  FaList, FaTh, FaSearch, FaTimes 
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

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Lấy giá trị category (tên danh mục) và q (từ khóa tìm kiếm) từ URL
  const categoryNameFromUrl = searchParams.get('category'); // Sửa tên biến cho chuẩn
  const queryFromUrl = searchParams.get('q') || '';

  // 1. Fetch data một lần khi load trang hoặc khi tìm kiếm bằng chữ (queryFromUrl)
  useEffect(() => {
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
    }
    fetchData();
  }, [queryFromUrl]); // Xóa location.search và categoryIdFromUrl khỏi dependency này

  // 2. Tự động check vào ô danh mục khi có params 'category' trên URL
  useEffect(() => {
    // Chỉ chạy khi đã tải xong categories và có categoryNameFromUrl
    if (categories.length > 0 && categoryNameFromUrl) {
      // Tìm xem categoryName trên URL có trùng với tên danh mục nào không
      const matchedCategory = categories.find(c => c.name.toLowerCase() === categoryNameFromUrl.toLowerCase());
      
      if (matchedCategory) {
        // Nếu tìm thấy, set state để nó tự động check vào ô đó
        setSelectedCategories([matchedCategory.id]);
      } else {
         // Nếu không khớp (ví dụ người dùng gõ bậy trên url), thì bỏ check
        setSelectedCategories([]);
      }
    } else if (!categoryNameFromUrl) {
        // Nếu trên URL không có ?category=... thì bỏ check hết
        setSelectedCategories([]);
    }
  }, [categoryNameFromUrl, categories]);

  // 3. Effect lọc sản phẩm giữ nguyên
  useEffect(() => {
    filterAndSortProducts();
  }, [products, sortBy, priceRange, selectedCategories, searchQuery]);

  // Sửa lại hàm fetchData một chút để nó không dùng categoryId trên URL nữa
  const fetchData = async () => {
    try {
      setLoading(true);
      // Luôn lấy tất cả sản phẩm, vì ta sẽ lọc bằng JS ở dưới
      let url = `/products?size=1000`;

      if (queryFromUrl) {
        url += `&name=${encodeURIComponent(queryFromUrl)}`;
      }

      const [productsRes, categoriesRes] = await Promise.all([
        api.get(url),
        api.get('/categories')
      ]);

      const data = productsRes.data.content || productsRes.data;
      const validData = Array.isArray(data) ? data : [];
      
      setProducts(validData);
      setFilteredProducts(validData);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter(p =>
        p.categories?.some(cat => selectedCategories.includes(cat.id))
      );
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      );
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

  const handleCategoryToggle = (id) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/products');
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000000]);
    setSortBy('newest');
    setSearchQuery('');
    navigate('/products');
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (num) => {
    setCurrentPage(num);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="container-fluid bg-light py-4">
      <div className="container">
        <div className="row mb-4 align-items-center">
          <div className="col-md-6">
            <h1 className="fw-bold mb-1">Cửa Hàng</h1>
            <p className="text-muted mb-0">Hiển thị {filteredProducts.length} sản phẩm</p>
          </div>
          <div className="col-md-6 d-flex justify-content-md-end gap-2 mt-3 mt-md-0">
            <button className="btn btn-outline-dark d-lg-none" onClick={() => setShowFilters(!showFilters)}><FaFilter /></button>
            <div className="btn-group">
              <button className={`btn ${viewMode === 'grid' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setViewMode('grid')}><FaTh /></button>
              <button className={`btn ${viewMode === 'list' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setViewMode('list')}><FaList /></button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className={`col-lg-3 ${showFilters ? 'd-block' : 'd-none d-lg-block'}`}>
            <div className="card shadow-sm border-0 rounded-3 mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3 d-lg-none">
                  <h5 className="fw-bold">Bộ lọc</h5>
                  <button className="btn-close" onClick={() => setShowFilters(false)}></button>
                </div>
                
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Tìm kiếm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <button className="btn btn-dark" type="submit"><FaSearch /></button>
                  </div>
                </form>

                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Danh mục</h6>
                  {categories.map(c => (
                    <div key={c.id} className="form-check mb-2">
                      <input className="form-check-input" type="checkbox" checked={selectedCategories.includes(c.id)} onChange={() => handleCategoryToggle(c.id)} id={`cat-${c.id}`} />
                      <label className="form-check-label" htmlFor={`cat-${c.id}`}>{c.name}</label>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Khoảng giá</h6>
                  <input type="range" className="form-range" min="0" max="10000000" step="100000" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} />
                  <div className="d-flex justify-content-between small text-muted">
                    <span>{priceRange[0].toLocaleString()}đ</span>
                    <span>{priceRange[1].toLocaleString()}đ</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Sắp xếp</h6>
                  <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="newest">Mới nhất</option>
                    <option value="price-low">Giá: Thấp - Cao</option>
                    <option value="price-high">Giá: Cao - Thấp</option>
                    <option value="name">Tên: A - Z</option>
                  </select>
                </div>

                <button className="btn btn-link text-danger w-100 text-decoration-none p-0" onClick={clearFilters}>Xóa tất cả bộ lọc</button>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            {currentProducts.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-3 shadow-sm">
                <FaSearch size={48} className="text-muted mb-3 opacity-25" />
                <h5 className="text-muted">Không tìm thấy sản phẩm phù hợp</h5>
              </div>
            ) : (
              <>
                <div className={`row ${viewMode === 'grid' ? 'row-cols-1 row-cols-md-2 row-cols-lg-3' : 'row-cols-1'}`}>
                  {currentProducts.map(p => (
                    <div key={p.id} className="col mb-4">
                      <ProductCard product={p} viewMode={viewMode} />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage - 1)}>Trước</button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage + 1)}>Sau</button>
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
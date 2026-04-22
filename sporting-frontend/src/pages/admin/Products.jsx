import React, { useEffect, useState, useRef } from 'react';
import api from '../../api/axiosConfig';
import { 
    FaEdit, FaTrash, FaPlus, FaSave, FaTimes, 
    FaChevronLeft, FaChevronRight, FaSearch, FaCloudUploadAlt,
    FaBox, FaInfoCircle, FaImage, FaCheckCircle
} from 'react-icons/fa';

const Products = () => {
    // --- STATE ---
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const initialFormData = {
        name: '', 
        brand: 'Adidas',
        price: '', 
        description: '', 
        categoryId: '',
        sizeType: 'NUMERIC',
        productSizes: [],
        imgUrls: ['', '', '', ''], // Hỗ trợ tối đa 4 ảnh
        color: 'Trắng'
    };
    const [formData, setFormData] = useState(initialFormData);
    const fileInputRef = useRef(null);

    // --- LOAD DATA ---
    const loadData = async () => {
        setLoading(true);
        try {
            const url = `/products?page=${page}&size=10&keyword=${encodeURIComponent(searchTerm)}`;
            const [pRes, cRes] = await Promise.all([api.get(url), api.get('/categories')]);
            setProducts(pRes.data.content || []);
            setTotalPages(pRes.data.totalPages || 0);
            setCategories(cRes.data || []);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [page, searchTerm]);

    // --- HANDLERS ---
    const handleEdit = (p) => {
        setEditingId(p.id);
        const catId = p.categories?.[0]?.id || '';
        
        // Pipeline Fix: Trích xuất ảnh từ Variant hoặc Product trực tiếp
        const rawImgUrl = p.variants?.[0]?.imgUrl || p.imgUrl || '';
        const splitUrls = rawImgUrl.split('|').map(u => u.trim());
        const finalUrls = ['', '', '', ''];
        splitUrls.forEach((url, i) => { if(i < 4) finalUrls[i] = url; });

        setFormData({
            name: p.name,
            brand: p.brand || 'Adidas',
            price: p.price,
            description: p.description || '',
            categoryId: catId,
            sizeType: p.sizeType || 'NUMERIC',
            productSizes: p.variants?.[0]?.productSizes?.map(s => ({ size: s.size, quantity: s.quantity })) || [],
            imgUrls: finalUrls,
            color: p.variants?.[0]?.color || 'Trắng'
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
            try {
                await api.delete(`/products/${id}`);
                loadData();
            } catch (err) {
                alert("Không thể xóa sản phẩm này.");
            }
        }
    };

    const handleFileChange = async (index, e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
                return;
            }
            
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            
            try {
                const res = await api.post('/upload/product', uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const newUrls = [...formData.imgUrls];
                newUrls[index] = res.data; // URL tương đối từ server
                setFormData({ ...formData, imgUrls: newUrls });
            } catch (err) {
                alert("Lỗi upload ảnh: " + (err.response?.data || err.message));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const combinedImgUrl = formData.imgUrls.filter(u => u.trim() !== '').join('|');
        
        const payload = { 
            name: formData.name, 
            price: formData.price, 
            brand: formData.brand, 
            description: formData.description,
            imgUrl: combinedImgUrl,
            sizeType: formData.sizeType,
            categories: [{ id: formData.categoryId }],
            variants: [{ color: formData.color, productSizes: formData.productSizes, imgUrl: combinedImgUrl }]
        };

        try {
            if (editingId) await api.put(`/products/${editingId}`, payload);
            else await api.post('/products', payload);
            alert("Lưu sản phẩm thành công!");
            resetForm();
            loadData();
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || "Không thể lưu sản phẩm"));
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData(initialFormData);
    };

    const getImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/150?text=No+Image';
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        return `http://localhost:8081${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const getThumbnail = (p) => {
        const urlString = p.variants?.[0]?.imgUrl || p.imgUrl || '';
        const firstUrl = urlString.split('|')[0]?.trim();
        return getImageUrl(firstUrl);
    };

    // --- RENDER ---
    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Quản lý Sản phẩm</h1>
                <button className="btn btn-primary shadow-sm" onClick={() => setShowForm(true)}>
                    <FaPlus className="me-2" /> Thêm sản phẩm mới
                </button>
            </div>

            {/* Redesigned Form Section (2-Column Layout) */}
            {showForm && (
                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex justify-content-between align-items-center bg-primary text-white">
                        <h6 className="m-0 font-weight-bold">
                            {editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                        </h6>
                        <button className="btn btn-link text-white p-0" onClick={resetForm}><FaTimes /></button>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {/* LEFT COLUMN: Basic Info */}
                                <div className="col-lg-7 border-end">
                                    <h5 className="h6 font-weight-bold text-primary mb-3"><FaInfoCircle className="me-2"/> Thông tin cơ bản</h5>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label small font-weight-bold">Tên sản phẩm</label>
                                            <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="VD: Giày Adidas Ultraboost" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small font-weight-bold">Thương hiệu</label>
                                            <select className="form-select" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})}>
                                                {['Adidas', 'Nike', 'Puma', 'Jordan', 'Reebok'].map(b => <option key={b} value={b}>{b}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small font-weight-bold">Danh mục</label>
                                            <select className="form-select" required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                                                <option value="">Chọn danh mục...</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small font-weight-bold">Giá bán (VNĐ)</label>
                                            <input type="number" className="form-control" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small font-weight-bold">Màu sắc</label>
                                            <input type="text" className="form-control" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small font-weight-bold">Mô tả</label>
                                            <textarea className="form-control" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                                        </div>

                                        {/* SIZE MANAGEMENT SECTION */}
                                        <div className="col-12 mt-4">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5 className="h6 font-weight-bold text-primary m-0"><FaBox className="me-2"/> Quản lý Tồn kho & Kích cỡ</h5>
                                                <div className="btn-group btn-group-sm">
                                                    <button type="button" className="btn btn-outline-primary" onClick={() => {
                                                        const isShoes = categories.find(c => c.id == formData.categoryId)?.name?.toUpperCase().includes('GIÀY');
                                                        let quickSizes = isShoes 
                                                            ? [39, 40, 41, 42, 43].map(s => ({ size: String(s), quantity: 50 }))
                                                            : ['S', 'M', 'L', 'XL'].map(s => ({ size: s, quantity: 100 }));
                                                        setFormData({...formData, productSizes: quickSizes});
                                                    }}>Tạo nhanh</button>
                                                    <button type="button" className="btn btn-primary" onClick={() => setFormData({...formData, productSizes: [...formData.productSizes, { size: '', quantity: 0 }]})}><FaPlus size={10}/></button>
                                                </div>
                                            </div>
                                            
                                            <div className="table-responsive border rounded bg-white">
                                                <table className="table table-sm table-borderless mb-0">
                                                    <thead className="bg-light">
                                                        <tr>
                                                            <th className="small ps-3">Size</th>
                                                            <th className="small">Số lượng</th>
                                                            <th className="small text-center">Xóa</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {formData.productSizes.length > 0 ? formData.productSizes.map((s, idx) => (
                                                            <tr key={idx} className="border-bottom">
                                                                <td className="ps-3 py-2">
                                                                    <input type="text" className="form-control form-control-sm" placeholder="VD: 42 hoặc XL" value={s.size} onChange={e => {
                                                                        const newSizes = [...formData.productSizes]; newSizes[idx].size = e.target.value; setFormData({...formData, productSizes: newSizes});
                                                                    }} />
                                                                </td>
                                                                <td className="py-2">
                                                                    <input type="number" className="form-control form-control-sm" value={s.quantity} onChange={e => {
                                                                        const newSizes = [...formData.productSizes]; newSizes[idx].quantity = parseInt(e.target.value); setFormData({...formData, productSizes: newSizes});
                                                                    }} />
                                                                </td>
                                                                <td className="text-center py-2">
                                                                    <button type="button" className="btn btn-link text-danger p-0" onClick={() => {
                                                                        const newSizes = formData.productSizes.filter((_, i) => i !== idx); setFormData({...formData, productSizes: newSizes});
                                                                    }}><FaTrash size={12}/></button>
                                                                </td>
                                                            </tr>
                                                        )) : (
                                                            <tr><td colSpan="3" className="text-center py-3 text-muted small">Chưa có thông tin kích cỡ. Hãy bấm "+" hoặc "Tạo nhanh".</td></tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: Images & Preview */}
                                <div className="col-lg-5">
                                    <h5 className="h6 font-weight-bold text-primary mb-3"><FaImage className="me-2"/> Hình ảnh sản phẩm</h5>
                                    <div className="row g-2">
                                        {formData.imgUrls.map((url, idx) => (
                                            <div key={idx} className="col-6">
                                                <div className="image-upload-box border rounded d-flex flex-column align-items-center justify-content-center p-2 position-relative bg-light" style={{ height: '150px' }}>
                                                    {url ? (
                                                        <>
                                                            <img src={getImageUrl(url)} className="w-100 h-100 object-fit-cover rounded" alt="preview" />
                                                            <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1" onClick={() => {
                                                                const newUrls = [...formData.imgUrls]; newUrls[idx] = ''; setFormData({...formData, imgUrls: newUrls});
                                                            }}><FaTimes size={10}/></button>
                                                        </>
                                                    ) : (
                                                        <label className="text-center cursor-pointer m-0" style={{ cursor: 'pointer' }}>
                                                            <FaCloudUploadAlt size={30} className="text-primary mb-1" />
                                                            <div className="small font-weight-bold">Tải ảnh {idx + 1}</div>
                                                            <input type="file" className="d-none" accept="image/*" onChange={(e) => handleFileChange(idx, e)} />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 alert alert-info py-2 small">
                                        <FaInfoCircle className="me-1" /> Kéo thả hoặc click để chọn ảnh. Ưu tiên ảnh tỉ lệ 1:1.
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-end border-top pt-3">
                                <button type="button" className="btn btn-secondary me-2" onClick={resetForm}>Hủy bỏ</button>
                                <button type="submit" className="btn btn-primary px-4"><FaSave className="me-2"/> Lưu sản phẩm</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Standard Data Table Section */}
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex justify-content-between align-items-center bg-white">
                    <h6 className="m-0 font-weight-bold text-primary">Danh sách sản phẩm trong kho</h6>
                    <div className="input-group" style={{ width: '250px' }}>
                        <input type="text" className="form-control form-control-sm" placeholder="Tìm tên sản phẩm..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <span className="input-group-text bg-primary text-white border-0"><FaSearch size={12}/></span>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th className="px-4">ID</th>
                                    <th>Hình ảnh</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Danh mục</th>
                                    <th>Giá bán</th>
                                    <th>Thương hiệu</th>
                                    <th className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="7" className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
                                ) : products.length > 0 ? products.map(p => (
                                    <tr key={p.id}>
                                        <td className="px-4 text-muted font-weight-bold">#{p.id}</td>
                                        <td>
                                            <img 
                                                src={getThumbnail(p)} 
                                                className="product-thumb" 
                                                alt={p.name}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error'; }}
                                            />
                                        </td>
                                        <td>
                                            <div className="font-weight-bold text-dark">{p.name}</div>
                                            <div className="small text-muted">{p.variants?.[0]?.color || 'Màu mặc định'}</div>
                                        </td>
                                        <td>
                                            <span className="badge bg-light text-primary border border-primary px-2 py-1">
                                                {p.categories?.[0]?.name || 'Chưa phân loại'}
                                            </span>
                                        </td>
                                        <td className="font-weight-bold text-dark">
                                            {p.price?.toLocaleString()}đ
                                        </td>
                                        <td>{p.brand}</td>
                                        <td className="text-center">
                                            <div className="btn-group shadow-sm">
                                                <button className="btn btn-white btn-sm text-primary border" title="Chỉnh sửa" onClick={() => handleEdit(p)}>
                                                    <FaEdit />
                                                </button>
                                                <button className="btn btn-white btn-sm text-danger border" title="Xóa" onClick={() => handleDelete(p.id)}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="7" className="text-center py-4">Không tìm thấy sản phẩm nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Pagination Footer */}
                <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center">
                    <span className="small text-muted">Trang {page + 1} / {totalPages}</span>
                    <nav>
                        <ul className="pagination pagination-sm mb-0 shadow-sm">
                            <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setPage(page - 1)}><FaChevronLeft size={10}/></button>
                            </li>
                            <li className={`page-item ${page + 1 >= totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setPage(page + 1)}><FaChevronRight size={10}/></button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Products;
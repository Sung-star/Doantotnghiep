import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { 
    FaEdit, FaTrash, FaPlus, FaSave, FaTimes, 
    FaChevronLeft, FaChevronRight, FaSearch, FaUpload, FaPlusCircle
} from 'react-icons/fa';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);

    // --- State cho form đã được cập nhật ---
    const initialFormData = {
        name: '', price: '', imgUrl: '', description: '', 
        categoryId: '', brand: '', color: '',
        productSizes: [] // Bắt đầu với mảng rỗng
    };
    const [formData, setFormData] = useState(initialFormData);
    const [isShoeCategory, setIsShoeCategory] = useState(false);

    // State cho việc thêm size/số lượng động
    const [currentSize, setCurrentSize] = useState('');
    const [currentQuantity, setCurrentQuantity] = useState(0);

    const loadData = async () => {
        try {
            const url = `/products?page=${page}&size=5&name=${encodeURIComponent(searchTerm)}`;
            const [pRes, cRes] = await Promise.all([
                api.get(url), 
                api.get('/categories')
            ]);
            setProducts(pRes.data.content || []);
            setTotalPages(pRes.data.totalPages || 0);
            setCategories(cRes.data || []);
        } catch (err) { console.error("Lỗi tải dữ liệu:", err); }
    };

    useEffect(() => { loadData(); }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        loadData();
    };

    // --- Cập nhật logic khi chọn category ---
    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setFormData({ ...formData, categoryId: selectedCategoryId, productSizes: [] }); // Reset size khi đổi category

        // QUAN TRỌNG: Thay "Giày" bằng tên danh mục giày của bạn nếu khác
        const isShoe = categories.find(c => c.id.toString() === selectedCategoryId)?.name === "Giày";
        setIsShoeCategory(isShoe);
    };
    
    // --- Logic thêm một cặp size-số lượng vào formData ---
    const handleAddSize = () => {
        if (!currentSize || formData.productSizes.some(ps => ps.size === currentSize)) {
            alert("Size không được rỗng hoặc đã tồn tại!");
            return;
        }
        const newSize = { size: currentSize, quantity: parseInt(currentQuantity) || 0 };
        setFormData({ ...formData, productSizes: [...formData.productSizes, newSize] });
        setCurrentSize('');
        setCurrentQuantity(0);
    };
    
    // --- Logic xóa một cặp size-số lượng ---
    const handleRemoveSize = (sizeToRemove) => {
        setFormData({
            ...formData,
            productSizes: formData.productSizes.filter(ps => ps.size !== sizeToRemove)
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData({ ...formData, imgUrl: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Cập nhật handleEdit ---
    const handleEdit = (p) => {
        setEditingId(p.id);
        setImagePreview(p.imgUrl);
        
        const categoryId = p.categories?.[0]?.id || '';
        // QUAN TRỌNG: Thay "Giày" bằng tên danh mục giày của bạn nếu khác
        const isShoe = categories.find(c => c.id.toString() === categoryId.toString())?.name === "Giày";
        setIsShoeCategory(isShoe);

        setFormData({
            name: p.name, price: p.price, imgUrl: p.imgUrl, 
            description: p.description || '',
            brand: p.brand || '', color: p.color || '',
            categoryId: categoryId,
            productSizes: p.productSizes?.map(s => ({ size: s.size, quantity: s.quantity })) || []
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData, categories: [{ id: formData.categoryId }] };
        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, payload);
            } else {
                await api.post('/products', payload);
            }
            alert("Thao tác thành công!");
            resetForm();
            loadData();
        } catch (err) { alert("Lỗi khi lưu sản phẩm!"); }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setImagePreview(null);
        setFormData(initialFormData);
        setIsShoeCategory(false);
        setCurrentSize('');
        setCurrentQuantity(0);
    };

    return (
        <div className="container-fluid p-4 bg-light min-vh-100">
            {/* Header + Search Bar */}
            <div className="row align-items-center mb-4">
                <div className="col-md-4">
                    <h3 className="fw-bold text-dark border-start border-4 border-primary ps-3 m-0">QUẢN LÝ SẢN PHẨM</h3>
                </div>
                <div className="col-md-5">
                    <form onSubmit={handleSearch} className="d-flex shadow-sm rounded-pill overflow-hidden bg-white">
                        <input type="text" className="form-control border-0 ps-4 shadow-none" placeholder="Tìm tên sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button className="btn btn-white px-3" type="submit"><FaSearch className="text-primary" /></button>
                    </form>
                </div>
                <div className="col-md-3 text-end">
                    {!showForm && (<button className="btn btn-primary shadow-sm px-4 fw-bold rounded-pill" onClick={() => setShowForm(true)}><FaPlus className="me-2" /> THÊM MỚI</button>)}
                </div>
            </div>

            {/* Form Thêm/Sửa */}
            {showForm && (
                <div className="card border-0 shadow-lg mb-5" style={{ borderRadius: '20px' }}>
                    <div className="card-body p-4 p-md-5">
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                            <h5 className="fw-bold m-0 text-primary">{editingId ? "CẬP NHẬT SẢN PHẨM" : "THÊM SẢN PHẨM MỚI"}</h5>
                            <button className="btn btn-light rounded-circle" onClick={resetForm}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-4">
                                {/* Cột bên trái: Ảnh */}
                                <div className="col-md-4">
                                    <div className="border-dashed rounded-4 p-3 text-center bg-light position-relative" style={{ border: '2px dashed #ccc', minHeight: '300px' }}>
                                        {imagePreview ? <img src={imagePreview} className="img-fluid rounded shadow-sm mb-2" style={{ maxHeight: '250px' }} alt="Preview" />
                                         : <div className="py-5 text-muted"><FaUpload size={40} className="mb-2 opacity-50" /><p className="small">Chưa có ảnh</p></div>}
                                        <input type="file" className="form-control form-control-sm" accept="image/*" onChange={handleImageChange} />
                                        <label className="small text-secondary mt-2 d-block">Chọn ảnh từ thiết bị</label>
                                    </div>
                                </div>

                                {/* Cột bên phải: Thông tin */}
                                <div className="col-md-8">
                                    <div className="row g-3">
                                        <div className="col-12"><label className="small fw-bold text-secondary">Tên sản phẩm</label><input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                                        <div className="col-md-6"><label className="small fw-bold text-secondary">Thương hiệu</label><input type="text" className="form-control" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} /></div>
                                        <div className="col-md-6"><label className="small fw-bold text-secondary">Màu sắc</label><input type="text" className="form-control" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} /></div>
                                        <div className="col-md-6"><label className="small fw-bold text-secondary">Giá bán (đ)</label><input type="number" className="form-control" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
                                        <div className="col-md-6"><label className="small fw-bold text-secondary">Danh mục</label>
                                            <select className="form-select" required value={formData.categoryId} onChange={handleCategoryChange}>
                                                <option value="">Chọn loại...</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        
                                        {/* --- Khu vực nhập Size/Số lượng động --- */}
                                        <div className="col-12 mt-3">
                                            <label className="small fw-bold d-block mb-2 text-dark">CẤU HÌNH TỒN KHO</label>
                                            <div className='p-3 border rounded bg-light'>
                                                <div className="row g-2 align-items-center mb-3">
                                                    <div className="col"><input type="text" className="form-control" value={currentSize} onChange={e => setCurrentSize(e.target.value)} placeholder={isShoeCategory ? "Nhập size số (vd: 40)" : "Nhập size chữ (vd: M)"}/></div>
                                                    <div className="col"><input type="number" className="form-control" value={currentQuantity} onChange={e => setCurrentQuantity(e.target.value)} placeholder="Số lượng"/></div>
                                                    <div className="col-auto"><button type="button" className="btn btn-success" onClick={handleAddSize}><FaPlusCircle/></button></div>
                                                </div>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {formData.productSizes.map(ps => (
                                                        <div key={ps.size} className="badge bg-dark d-flex align-items-center gap-2">
                                                            <span className="fw-bold">{ps.size}</span>
                                                            <span className="badge bg-white text-dark">{ps.quantity}</span>
                                                            <button type="button" className="btn-close btn-close-white ms-1" style={{fontSize: '0.6rem'}} onClick={() => handleRemoveSize(ps.size)}></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 text-end mt-4">
                                    <button type="button" className="btn btn-light me-2 fw-bold" onClick={resetForm}>HỦY BỎ</button>
                                    <button type="submit" className="btn btn-dark px-5 fw-bold"><FaSave className="me-2" /> LƯU SẢN PHẨM</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bảng danh sách */}
            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark text-uppercase small">
                        <tr>
                            <th className="ps-4">Sản phẩm</th>
                            <th>Thương hiệu/Màu</th>
                            <th>Loại</th>
                            <th>Giá</th>
                            <th>Kho hàng</th>
                            <th className="text-end pe-4">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? products.map(p => (
                            <tr key={p.id}>
                                <td className="ps-4">
                                    <div className='d-flex align-items-center'>
                                        <img src={p.imgUrl} width="45" height="60" className="object-fit-cover rounded border me-3" alt={p.name} />
                                        <div>
                                            <div className="fw-bold">{p.name}</div>
                                            <div className="text-muted small">ID: #{p.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div>{p.brand || '---'}</div>
                                    <div className='small text-muted'>{p.color || '---'}</div>
                                </td>
                                <td><span className="badge bg-secondary-subtle text-secondary border px-3">{p.categories?.[0]?.name || '---'}</span></td>
                                <td className="text-danger fw-bold">{p.price?.toLocaleString()}đ</td>
                                <td>
                                    <div className="d-flex flex-wrap gap-1">
                                        {p.productSizes?.sort((a,b) => a.size.localeCompare(b.size, undefined, {numeric: true})).map(s => (
                                            <div key={s.id || s.size} className="text-center border rounded px-1 bg-light" style={{minWidth: '35px'}}>
                                                <div className="fw-bold" style={{fontSize: '0.6rem'}}>{s.size}</div>
                                                <div className="small">{s.quantity}</div>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="text-end pe-4">
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(p)}><FaEdit /></button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={async () => {
                                        if(window.confirm("Xác nhận xóa sản phẩm này?")) {
                                            await api.delete(`/products/${p.id}`);
                                            loadData();
                                        }
                                    }}><FaTrash /></button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" className="text-center py-5 text-muted">Không tìm thấy sản phẩm nào</td></tr>
                        )}
                    </tbody>
                </table>
                {/* Phân trang */}
                <div className="d-flex justify-content-center align-items-center p-3 border-top bg-light gap-3">
                    <button className="btn btn-sm btn-outline-dark rounded-circle" disabled={page === 0} onClick={() => setPage(page - 1)}><FaChevronLeft /></button>
                    <span className="small fw-bold">Trang {page + 1} / {totalPages}</span>
                    <button className="btn btn-sm btn-outline-dark rounded-circle" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}><FaChevronRight /></button>
                </div>
            </div>
        </div>
    );
};

export default Products;
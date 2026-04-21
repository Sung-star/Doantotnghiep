import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { 
    FaEdit, FaTrash, FaPlus, FaSave, FaTimes, 
    FaChevronDown, FaChevronRight, FaFolder, FaFolderOpen, 
    FaLayerGroup, FaSitemap 
} from 'react-icons/fa';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', parentId: '' });
    const [expandedCategories, setExpandedCategories] = useState({});

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error("Lỗi lấy danh mục:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                parent: formData.parentId ? { id: formData.parentId } : null
            };

            if (editingId) await api.put(`/categories/${editingId}`, payload);
            else await api.post('/categories', payload);
            
            alert("Đã cập nhật danh mục thành công!");
            resetForm();
            fetchCategories();
        } catch (err) { alert("Lỗi: Không thể lưu danh mục!"); }
    };

    const handleEdit = (cat) => {
        setEditingId(cat.id);
        setFormData({
            name: cat.name,
            description: cat.description || '',
            parentId: cat.parent?.id || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCategories();
            } catch (err) { alert("Lỗi: Danh mục này đang chứa sản phẩm hoặc danh mục con!"); }
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', parentId: '' });
        setShowForm(false);
        setEditingId(null);
    };

    const toggleExpand = (id) => {
        setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getChildren = (parentId) => {
        return categories.filter(c => (parentId === null ? !c.parent : c.parent?.id === parentId));
    };

    const CategoryRow = ({ category, level = 0 }) => {
        const children = getChildren(category.id);
        const isExpanded = expandedCategories[category.id];
        const hasChildren = children.length > 0;

        return (
            <React.Fragment>
                <tr className="align-middle">
                    <td className="px-4" style={{ paddingLeft: `${level * 30 + 20}px` }}>
                        <div className="d-flex align-items-center">
                            {hasChildren ? (
                                <span onClick={() => toggleExpand(category.id)} style={{ cursor: 'pointer', width: '25px' }} className="text-primary">
                                    {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                                </span>
                            ) : (
                                <span style={{ width: '25px' }}></span>
                            )}
                            <span className="me-2 text-warning">
                                {hasChildren ? (isExpanded ? <FaFolderOpen /> : <FaFolder />) : <FaLayerGroup />}
                            </span>
                            <span className={level === 0 ? "font-weight-bold text-dark" : "text-muted"}>
                                {category.name}
                            </span>
                        </div>
                    </td>
                    <td className="small text-muted">{category.description || '---'}</td>
                    <td className="text-center">
                        <div className="btn-group shadow-sm">
                            <button className="btn btn-white btn-sm text-primary border" onClick={() => handleEdit(category)}><FaEdit /></button>
                            <button className="btn btn-white btn-sm text-danger border" onClick={() => handleDelete(category.id)}><FaTrash /></button>
                        </div>
                    </td>
                </tr>
                {isExpanded && hasChildren && children.map(child => <CategoryRow key={child.id} category={child} level={level + 1} />)}
            </React.Fragment>
        );
    };

    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Quản lý Danh mục</h1>
                <button className="btn btn-primary shadow-sm" onClick={() => setShowForm(!showForm)}>
                    <FaPlus className="me-2" /> Thêm danh mục mới
                </button>
            </div>

            {showForm && (
                <div className="card shadow mb-4">
                    <div className="card-header py-3 bg-primary text-white d-flex justify-content-between align-items-center">
                        <h6 className="m-0 font-weight-bold">{editingId ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}</h6>
                        <button className="btn btn-link text-white p-0" onClick={resetForm}><FaTimes /></button>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="row g-3">
                            <div className="col-md-5">
                                <label className="form-label small font-weight-bold">Tên danh mục</label>
                                <input type="text" className="form-control" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small font-weight-bold">Danh mục cha</label>
                                <select className="form-select" value={formData.parentId} onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}>
                                    <option value="">-- Cấp cao nhất --</option>
                                    {categories.filter(c => c.id !== editingId).map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 d-flex align-items-end">
                                <button type="submit" className="btn btn-primary w-100"><FaSave className="me-2"/> Lưu danh mục</button>
                            </div>
                            <div className="col-12">
                                <label className="form-label small font-weight-bold">Mô tả</label>
                                <textarea className="form-control" rows="2" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card shadow mb-4">
                <div className="card-header py-3 bg-white">
                    <h6 className="m-0 font-weight-bold text-primary">Cấu trúc cây danh mục</h6>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th className="px-4">Tên danh mục</th>
                                    <th>Mô tả</th>
                                    <th className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="3" className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
                                ) : (
                                    getChildren(null).map(rootCat => <CategoryRow key={rootCat.id} category={rootCat} />)
                                )}
                                {!loading && getChildren(null).length === 0 && (
                                    <tr><td colSpan="3" className="text-center py-4">Chưa có danh mục nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;
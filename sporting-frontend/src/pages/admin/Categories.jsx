import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaChevronDown, FaChevronRight } from 'react-icons/fa';

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
      console.error("Lỗi:", err);
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

      if (editingId) {
        await api.put(`/categories/${editingId}`, payload);
      } else {
        await api.post('/categories', payload);
      }
      alert("Thành công!");
      setFormData({ name: '', description: '', parentId: '' });
      setShowForm(false);
      setEditingId(null);
      fetchCategories();
    } catch (err) { alert("Lỗi khi lưu danh mục!"); }
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
    if (window.confirm("Xóa danh mục này?")) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) { alert("Không thể xóa (có thể đang có sản phẩm thuộc danh mục này)"); }
    }
  };

  const toggleExpand = (id) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Lọc lấy danh sách danh mục gốc (không có parent)
  const rootCategories = categories.filter(c => !c.parent);

  // Hàm lấy danh sách danh mục con của một danh mục cha
  const getChildren = (parentId) => categories.filter(c => c.parent && c.parent.id === parentId);

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Quản lý danh mục</h2>
        <button className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'} d-flex align-items-center gap-2`}
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', description: '', parentId: '' });
          }}>
          {showForm ? <><FaTimes /> Đóng</> : <><FaPlus /> Thêm mới</>}
        </button>
      </div>

      {showForm && (
        <div className="card shadow-sm border-0 mb-4 bg-light">
          <div className="card-body">
            <h5 className="fw-bold">{editingId ? "Cập nhật danh mục" : "Thêm danh mục mới"}</h5>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Tên danh mục" required
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Mô tả"
                  value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="col-md-4">
                <select className="form-select" value={formData.parentId} onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}>
                  <option value="">-- Tạo thành danh mục gốc mới --</option>
                  {rootCategories.filter(c => c.id !== editingId).map(c => (
                    <option key={c.id} value={c.id}>Thuộc danh mục: {c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-success w-100"><FaSave /> Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">Đang tải dữ liệu...</div>
          ) : (
            <div className="list-group">
              {rootCategories.map(cat => {
                const children = getChildren(cat.id);
                const isExpanded = expandedCategories[cat.id];
                return (
                  <div key={cat.id} className="list-group-item flex-column align-items-start p-0 mb-3 border rounded shadow-sm">
                    {/* Header danh mục cha */}
                    <div
                      className="d-flex w-100 justify-content-between align-items-center p-3"
                      style={{ backgroundColor: '#f8f9fa', cursor: 'pointer' }}
                      onClick={() => toggleExpand(cat.id)}
                    >
                      <div className="d-flex align-items-center">
                        <span className="me-3 text-secondary">
                          {children.length > 0 ? (isExpanded ? <FaChevronDown /> : <FaChevronRight />) : <span style={{ width: '16px', display: 'inline-block' }}></span>}
                        </span>
                        <h5 className="mb-0 fw-bold text-dark">{cat.name}</h5>
                        <span className="badge bg-primary ms-3 rounded-pill">{children.length} danh mục con</span>
                      </div>
                      <div>
                        <button className="btn btn-sm btn-warning me-2 px-3 fw-bold shadow-sm" onClick={(e) => { e.stopPropagation(); handleEdit(cat); }}><FaEdit /> Sửa</button>
                        <button className="btn btn-sm btn-danger px-3 fw-bold shadow-sm" onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}><FaTrash /> Xóa</button>
                      </div>
                    </div>

                    {/* Nội dung danh mục con sổ xuống */}
                    {isExpanded && (
                      <div className="p-0 bg-white border-top">
                        {children.length > 0 ? (
                          <table className="table table-hover mb-0">
                            <thead className="table-light">
                              <tr>
                                <th className="ps-5 text-muted small border-0">Tên danh mục con</th>
                                <th className="text-muted small border-0">Mô tả</th>
                                <th className="text-end pe-4 text-muted small border-0">Hành động</th>
                              </tr>
                            </thead>
                            <tbody>
                              {children.map(child => (
                                <tr key={child.id} className="align-middle">
                                  <td className="ps-5 fw-bold text-primary border-0">↳ {child.name}</td>
                                  <td className="text-secondary border-0">{child.description || "—"}</td>
                                  <td className="text-end pe-4 border-0">
                                    <button className="btn btn-sm btn-outline-warning me-2" onClick={(e) => { e.stopPropagation(); handleEdit(child); }}><FaEdit /></button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); handleDelete(child.id); }}><FaTrash /></button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="p-4 text-center text-muted small">Chưa có danh mục con nào.</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {rootCategories.length === 0 && (
                <div className="p-5 text-center text-muted border rounded bg-light">Chưa có danh mục nào. Hãy thêm mới!</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
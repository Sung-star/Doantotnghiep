import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

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
      if (editingId) {
        await api.put(`/categories/${editingId}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      alert("Thành công!");
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setEditingId(null);
      fetchCategories();
    } catch (err) { alert("Lỗi khi lưu danh mục!"); }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, description: cat.description || '' });
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

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Quản lý danh mục</h2>
        <button className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'} d-flex align-items-center gap-2`}
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({name:'', description:''}); }}>
          {showForm ? <><FaTimes /> Đóng</> : <><FaPlus /> Thêm mới</>}
        </button>
      </div>

      {showForm && (
        <div className="card shadow-sm border-0 mb-4 bg-light">
          <div className="card-body">
            <h5 className="fw-bold">{editingId ? "Cập nhật danh mục" : "Thêm danh mục mới"}</h5>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-5">
                <input type="text" className="form-control" placeholder="Tên danh mục" required
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="col-md-5">
                <input type="text" className="form-control" placeholder="Mô tả"
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
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
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr><th>ID</th><th>Tên danh mục</th><th>Mô tả</th><th className="text-end">Hành động</th></tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td>{cat.id}</td>
                      <td className="fw-bold">{cat.name}</td>
                      <td>{cat.description || "Không có mô tả"}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(cat)}><FaEdit /></button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat.id)}><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
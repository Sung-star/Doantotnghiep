import api from './axiosConfig';

const productApi = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
    create: (data) => api.post('/admin/products', data),
    update: (id, data) => api.put(`/admin/products/${id}`, data),
    delete: (id) => api.delete(`/admin/products/${id}`),
    getAll: (page = 0, size = 12) => {
        return api.get(`/products?page=${page}&size=${size}`);
    },
};

export default productApi;
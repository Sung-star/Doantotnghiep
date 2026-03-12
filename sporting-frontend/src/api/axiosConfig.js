import axios from 'axios';

const api = axios.create({
  // Thêm /api nếu backend của bạn có prefix này
  baseURL: 'http://localhost:8080', 
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor cho Request: Thêm Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho Response: Xử lý lỗi tập trung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      
      // Kiểm tra nếu đang ở trang admin thì về admin/login, ngược lại về /login
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
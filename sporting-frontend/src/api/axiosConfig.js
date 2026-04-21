import axios from 'axios';

const api = axios.create({
  // Thêm /api nếu backend của bạn có prefix này
  baseURL: 'http://127.0.0.1:8081', 
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
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
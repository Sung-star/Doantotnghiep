import axiosClient from "./axiosConfig"; // Sửa lại tên file import cho đúng

const userApi = {
    // 1. Lấy danh sách
    getAll: () => axiosClient.get('/users'),

    // 2. Thêm mới
    create: (data) => axiosClient.post('/users', data),

    // 3. Cập nhật thông tin
    update: (id, data) => axiosClient.put(`/users/${id}`, data),

    // 4. Xóa
    delete: (id) => axiosClient.delete(`/users/${id}`),

    // 5. Khóa / Mở khóa tài khoản (Cần Backend hỗ trợ API này)
    toggleStatus: (id, active) => axiosClient.put(`/users/${id}/status`, null, { 
        params: { active } 
    }),

    // 6. Đổi quyền (Admin/User)
    changeRole: (id, roleName) => axiosClient.put(`/users/${id}/role`, null, {
        params: { roleName }
    })
};

export default userApi;
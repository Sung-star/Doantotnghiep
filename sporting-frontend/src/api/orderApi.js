import api from './axiosConfig';

// Lấy tất cả đơn hàng của user hiện tại
export const getUserOrders = async () => {
  try {
    const response = await api.get('/orders/my-orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Lấy chi tiết một đơn hàng
export const getOrderDetails = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

// Tạo đơn hàng mới
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Cập nhật trạng thái đơn hàng (Admin only)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Hủy đơn hàng
export const cancelOrder = async (orderId) => {
  try {
    const response = await api.post(`/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error canceling order:', error);
    throw error;
  }
};

// Lấy danh sách tất cả đơn hàng (Admin only)
export const getAllOrders = async (page = 0, size = 20) => {
  try {
    const response = await api.get('/orders', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

// Tạo link thanh toán VNPAY
export const createVNPaymentLink = async (orderId, amount) => {
  try {
    const response = await api.post('/api/payment/create-payment', {
      orderId,
      amount
    });
    return response.data;
  } catch (error) {
    console.error('Error creating VNPay link:', error);
    throw error;
  }
};

// Lấy kết quả thanh toán VNPAY
export const getPaymentResult = async (queryParams) => {
  try {
    const response = await api.get('/api/payment/payment-result', {
      params: queryParams
    });
    return response.data;
  } catch (error) {
    console.error('Error getting payment result:', error);
    throw error;
  }
};

// Áp dụng voucher cho đơn hàng
export const applyVoucher = async (orderId, voucherCode) => {
  try {
    const response = await api.post(`/orders/${orderId}/apply-voucher`, {
      code: voucherCode
    });
    return response.data;
  } catch (error) {
    console.error('Error applying voucher:', error);
    throw error;
  }
};

export default {
  getUserOrders,
  getOrderDetails,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  createVNPaymentLink,
  getPaymentResult,
  applyVoucher
};

# 🏆 SportingShop - Luxury E-commerce Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%20Flash-purple.svg)](https://deepmind.google/technologies/gemini/)

SportingShop là một nền tảng thương mại điện tử cao cấp dành cho thời trang thể thao, được xây dựng với mục tiêu mang lại trải nghiệm mua sắm đẳng cấp (Luxury Experience) và tích hợp các công nghệ thông minh hàng đầu.

---

## ✨ Tính Năng Nổi Bật

### 🛍️ Client Experience
- **Luxury UI/UX**: Giao diện Full-width hiện đại, tối giản nhưng sang trọng, lấy cảm hứng từ các thương hiệu lớn như Adidas.
- **AI-Powered Search**: Tìm kiếm sản phẩm thông minh thông qua Google Gemini AI, giúp khách hàng tìm phong cách phù hợp một cách nhanh chóng.
- **Responsive Design**: Trải nghiệm mượt mà trên mọi thiết bị từ Desktop đến Mobile.
- **Premium Product Detail**: Chế độ xem ảnh lưới lớn, tích hợp Zoom thông minh và thanh thông tin ghim cố định (Sticky Info).
- **Cart & Wishlist**: Hệ thống giỏ hàng và danh sách yêu thích trực quan, nhanh chóng.

### 🛡️ Admin Dashboard
- **Quản lý toàn diện**: Theo dõi đơn hàng, quản lý sản phẩm, biến thể (màu sắc, kích thước) và người dùng.
- **Thống kê thông minh**: Dashboard trực quan với các chỉ số quan trọng.
- **Avatar Management**: Hệ thống tải lên và quản lý ảnh đại diện cho cả Admin và Khách hàng.

### 💳 Thanh Toán & Bảo Mật
- **Đa dạng thanh toán**: Tích hợp VNPAY, MoMo mang lại sự tiện lợi và bảo mật tuyệt đối.
- **Spring Security & JWT**: Hệ thống phân quyền và xác thực người dùng mạnh mẽ.

---

## 🚀 Công Nghệ Sử Dụng

| Thành phần | Công nghệ |
| :--- | :--- |
| **Backend** | Spring Boot 3.4.1, Spring Security, JPA/Hibernate |
| **Frontend** | ReactJS, Vite, Bootstrap 5, Lucide Icons |
| **Database** | MySQL 8.0 |
| **AI Integration** | Google Gemini API |
| **Styling** | Vanilla CSS (Luxury Design System) |

---

## 🛠️ Hướng Dẫn Cài Đặt

### 1. Yêu Cầu Hệ Thống
- Java 17+
- Node.js 18+
- MySQL 8.0

### 2. Cấu Hình Backend
1. Clone dự án: `git clone https://github.com/Sung-star/Doantotnghiep.git`
2. Tạo database: `sporting_shop` trong MySQL.
3. Cấu hình file `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=YOUR_USERNAME
   spring.datasource.password=YOUR_PASSWORD
   app.gemini.api-key=YOUR_GEMINI_KEY
   ```
4. Chạy dự án: `./mvnw spring-boot:run`

### 3. Cấu Hình Frontend
1. Truy cập thư mục: `cd sporting-frontend`
2. Cài đặt thư viện: `npm install`
3. Chạy dev server: `npm run dev`

---

## 📸 Ảnh Chụp Giao Diện

*(Thêm screenshot của bạn vào đây sau khi đã đưa lên Github)*

---

## 📄 Giấy Phép
Dự án được phát triển bởi **Sung-star** cho mục đích đồ án tốt nghiệp.

---
**🏆 Nâng tầm phong cách thể thao cùng SportingShop!**

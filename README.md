# 🏆 SportingShop - Luxury E-commerce Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.4-38bdf8.svg)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-purple.svg)](https://deepmind.google/technologies/gemini/)

**SportingShop** là nền tảng thương mại điện tử cao cấp (Luxury E-commerce Platform) chuyên biệt cho các dòng sản phẩm thời trang thể thao **Adidas**. Dự án được phát triển dưới dạng Đồ án tốt nghiệp, kết hợp giữa backend mạnh mẽ sử dụng **Spring Boot**, frontend hiện đại, mượt mà bằng **React (Vite)**, cùng sự hỗ trợ thông minh từ **Google Gemini AI** và các tính năng thực tế chuyên sâu (Thanh toán VNPAY/MoMo, Chat trực tuyến WebSocket, Tích điểm thành viên Loyalty, Tính phí vận chuyển động Shipping Config).

---

## 🌟 Tính Năng Nổi Bật

### 🛍️ 1. Trải nghiệm Khách hàng (Client Application)
*   **Giao diện Luxury Premium**: Thiết kế tối giản, sang trọng lấy cảm hứng từ trang chủ Adidas, tương thích tốt trên mọi thiết bị (Responsive Design).
*   **Tìm kiếm thông minh trợ lực AI (Google Gemini)**: Khách hàng nhập câu truy vấn tự nhiên (ví dụ: *"tìm giày chạy bộ màu đen size 42 dưới 2 triệu"*), Gemini AI sẽ phân tích và lọc dữ liệu chính xác trên database.
*   **Hệ thống Biến thể Sản phẩm**: Hỗ trợ sản phẩm nhiều thuộc tính phức tạp (Màu sắc, kích thước, số lượng tồn kho theo từng biến thể cụ thể).
*   **Giỏ hàng & Wishlist**: Quản lý giỏ hàng nhanh chóng, thêm sản phẩm yêu thích bằng 1 click.
*   **Hệ thống Thành viên & Tích điểm (Loyalty Points & Tiers)**:
    *   Tự động tích điểm dựa trên giá trị đơn hàng thành công.
    *   Phân hạng thành viên: *Bronze, Silver, Gold, Platinum*.
    *   Sử dụng điểm tích lũy để giảm giá khi thanh toán.
*   **Thanh toán đa dạng**:
    *   Thanh toán khi nhận hàng (COD).
    *   Tích hợp cổng thanh toán trực tuyến **VNPAY** và ví điện tử **MoMo**.
*   **Ưu đãi thông minh & Danh sách Voucher**: 
    *   Trang danh sách Voucher (`/vouchers`) hiển thị trực quan các mã giảm giá đang hoạt động.
    *   Áp dụng mã giảm giá trực quan (Voucher Selector) ngay tại bước thanh toán.
*   **Hệ thống Địa chỉ chi tiết**: Tích hợp danh mục địa lý hành chính Việt Nam (Tỉnh/Thành phố, Quận/Huyện, Phường/Xã) và tính toán phí vận chuyển linh hoạt theo địa điểm nhận hàng.
*   **Trang Liên hệ (Contact)**: Hỗ trợ khách hàng gửi thông tin liên hệ và phản hồi dễ dàng (`/contact`).
*   **Hỗ trợ trực tuyến**: Chatbox thời gian thực với Admin qua WebSocket và trung tâm hỗ trợ khách hàng (FAQ, Chính sách đổi trả, Bảo mật).

### 🛡️ 2. Hệ thống Quản trị viên (Admin Dashboard)
*   **Dashboard trực quan**: Biểu đồ thống kê doanh thu, số lượng đơn hàng, sản lượng bán ra theo thời gian bằng **Recharts**.
*   **Quản lý Danh mục & Sản phẩm**: CRUD danh mục, sản phẩm, biến thể chi tiết kèm hình ảnh.
*   **Quản lý Biến thể Kích thước (Sizes)**: Quản lý chi tiết danh mục kích cỡ cho từng dòng sản phẩm thời trang.
*   **Quản lý Đơn hàng**: Theo dõi và cập nhật trạng thái đơn hàng (Chờ xác nhận, Đang chuẩn bị, Đang giao, Đã giao, Đã hủy) kết hợp gửi email tự động cho khách hàng.
*   **Quản lý Thành viên (Loyalty Manager)**: Theo dõi giao dịch tích điểm, cấu hình hạng thành viên và quy đổi điểm thưởng.
*   **Cấu hình Phí vận chuyển (Shipping Config)**: Thiết lập biểu phí giao hàng động cho từng tỉnh thành trực tiếp từ giao diện Admin.
*   **Quản lý Khuyến mãi (Voucher Manager)**: Tạo mã giảm giá, giới hạn số lần sử dụng, thiết lập thời gian hiệu lực.
*   **Quản lý Đánh giá (Reviews Manager)**: Xem và duyệt các đánh giá, bình luận của khách hàng về sản phẩm.
*   **Hỗ trợ Khách hàng Real-time (Admin Chat)**: Nhận tin nhắn và tư vấn trực tiếp cho khách hàng đang trực tuyến qua giao diện Chat chuyên nghiệp.

### 🔄 3. Hệ thống Trả hàng & Đổi hàng (Return & Exchange System)
*   **Gửi Yêu cầu Đổi trả (Client)**: Cho phép khách hàng gửi yêu cầu Trả hàng - Hoàn tiền (RETURN) hoặc Đổi size/mẫu (EXCHANGE) trực tiếp từ giao diện lịch sử mua hàng đối với các đơn đã giao thành công (`DELIVERED`/`COMPLETED`).
*   **Phê duyệt & Từ chối (Admin)**: Giao diện quản trị yêu cầu đổi trả tập trung, giúp Admin xét duyệt lý do đổi trả nhanh chóng.
*   **Tự động hoàn kho & xử lý điểm thưởng**:
    *   **Hoàn kho**: Tự động cộng lại số lượng sản phẩm hoàn trả vào kho hàng tương ứng (`ProductSize`).
    *   **Loyalty Points**: Tự động khấu trừ số điểm tích lũy khách hàng nhận được từ đơn hoàn trả, và hoàn lại số điểm tích lũy khách hàng đã dùng để thanh toán đơn hàng đó.
    *   **Email tự động**: Gửi thông báo phê duyệt và xác nhận hoàn tiền chi tiết tới Email khách hàng.

---

## 🛠️ Công Nghệ Sử Dụng

### Backend (Spring Boot API)
*   **Core**: Spring Boot 3.2.0, Java 17.
*   **Security & Authentication**: Spring Security, JWT (JSON Web Token) cho phân quyền Client/Admin.
*   **Database Access**: Spring Data JPA, Hibernate ORM.
*   **Database**: MySQL 8.0.
*   **Real-time Communication**: Spring WebSocket với giao thức STOMP & SockJS.
*   **Mail Service**: Spring Boot Starter Mail (Gửi thông báo hóa đơn, đơn hàng qua SMTP).
*   **AI Integration**: RestTemplate tích hợp trực tiếp Google Gemini API (`gemini-2.0-flash`).
*   **Scheduling**: Spring Task Scheduling (Dọn dẹp log cũ, đồng bộ hóa tự động).

### Frontend (React Single Page Application)
*   **Build Tool & Runtime**: Vite, Node.js 18+.
*   **State & Routing**: React Router Dom v7, React Context API.
*   **Styling & UI Components**: Tailwind CSS 3.4.4, Bootstrap 5.3.8 (kết hợp linh hoạt giữa tiện ích Tailwind và cấu trúc Grid/Layout Bootstrap), Lucide Icons, React Icons.
*   **Animations**: Framer Motion cho các hiệu ứng chuyển trang và micro-interaction mượt mà.
*   **Analytics Visualization**: Recharts hỗ trợ vẽ biểu đồ doanh số.
*   **WebSocket Client**: SockJS-client, Stompjs.
*   **Carousels**: React Slick & Slick Carousel.

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
Doantotnghiep/
├── src/main/java/com/example/ecommerce/          # BACKEND SOURCE CODE
│   ├── config/                                    # Cấu hình Spring Security, WebSocket, VNPay, Mail, Async
│   ├── controllers/                               # REST Controllers xử lý API bổ sung (Admin Loyalty,...)
│   ├── resources/                                 # REST Controllers chính (Address, Product, Order, Chat, Search, Returns...)
│   ├── entities/                                  # JPA Entities (User, Product, Order, Loyalty, ChatMessage, ReturnRequest...)
│   ├── services/                                  # Business Logic (OrderService, LoyaltyService, GeminiService, ReturnRequestService...)
│   ├── specifications/                            # Lọc dữ liệu động nâng cao (JPA Specification)
│   └── dto/                                       # Data Transfer Objects
│
├── sporting-frontend/                             # FRONTEND SOURCE CODE (React JS + Vite)
│   ├── src/
│   │   ├── api/                                   # Cấu hình kết nối API (Axios Interceptors)
│   │   ├── components/                            # Components dùng chung (Navbar, Footer, ProtectedRoute,...)
│   │   ├── contexts/                              # Quản lý State toàn cục (Auth, Cart, Wishlist, Theme)
│   │   ├── pages/                                 # Giao diện các trang
│   │   │   ├── admin/                             # Trang quản trị (Analytics, Chat, Orders, Products, Vouchers, Returns...)
│   │   │   ├── auth/                              # Trang đăng ký, đăng nhập
│   │   │   ├── support/                           # Trang hỗ trợ chính sách (Shipping, Payment, ReturnPolicy, FAQ)
│   │   │   └── user/                              # Trang khách hàng (Home, Cart, Checkout, Profile, Orders, Loyalty, ReturnRequest, Contactpage, Voucherpage...)
│   │   ├── styles/                                # File CSS tùy chỉnh (index.css, Luxury Design System)
│   │   ├── App.jsx                                # Cấu hình Routing & Context Providers
│   │   └── main.jsx                               # Entrypoint của React App
│   └── package.json                               # Dependencies & scripts của frontend
│
├── .env.properties                                # Biến môi trường chạy local (Database, API Keys, SMTP Mail, VNPAY)
├── My workflow 2.json                             # Cấu hình n8n Workflow Chatbot AI
├── pom.xml                                        # Maven Dependencies
└── README.md                                      # Tài liệu hướng dẫn dự án
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Chuẩn bị Môi trường
*   **Java Development Kit (JDK)**: Phiên bản 17 hoặc mới hơn.
*   **Node.js**: Phiên bản 18+ (Kèm NPM).
*   **MySQL Server**: Phiên bản 8.0.

### 2. Cấu hình Hệ thống & Biến Môi trường
Tạo file `.env.properties` nằm ngay tại thư mục gốc của dự án (nằm cùng cấp với file `pom.xml` và thư mục `sporting-frontend`) dựa theo cấu trúc dưới đây:

```properties
# Cấu hình Database MySQL
DB_URL=jdbc:mysql://localhost:3306/sporting_shop?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=root
DB_PASSWORD=

# Cấu hình JWT Token
JWT_SECRET=your_super_secret_key_change_this

# Cấu hình Google Gemini AI
GEMINI_API_KEY=your_key_gemini

# Cấu hình Cổng thanh toán VNPAY (nếu có)
VNPAY_TMN_CODE=your_vnpay_code
VNPAY_HASH_SECRET=your_vnpay_secret

# Cấu hình Gửi Email tự động qua Gmail (SMTP)
SPRING_MAIL_USERNAME=vut51066@gmail.com
SPRING_MAIL_PASSWORD=zlfk hbfn vjbi sslq
```

*Lưu ý:* Vui lòng tạo sẵn database có tên `sporting_shop` trong MySQL trước khi chạy Backend:
```sql
CREATE DATABASE sporting_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Chạy Backend (Spring Boot)
Từ thư mục gốc chứa file `pom.xml`, chạy các lệnh sau:

*   **Trên Windows (Command Prompt hoặc PowerShell):**
    ```bash
    .\mvnw.cmd spring-boot:run
    ```
*   **Trên Linux/macOS:**
    ```bash
    chmod +x mvnw
    ./mvnw spring-boot:run
    ```

Backend sẽ khởi chạy tại cổng **8081** (http://localhost:8081).
*Gợi ý:* Trong lần chạy đầu tiên, hệ thống sẽ tự động tạo cấu trúc bảng (ddl-auto=update) và nạp dữ liệu mẫu ban đầu từ cấu hình `TestConfig.java` để bạn tiện kiểm thử các chức năng của hệ thống (sản phẩm, tài khoản mẫu).

### 4. Chạy Frontend (ReactJS - Vite)
Di chuyển vào thư mục ứng dụng frontend và khởi động môi trường phát triển:

```bash
# Di chuyển tới thư mục frontend
cd sporting-frontend

# Cài đặt toàn bộ các thư viện phụ thuộc
npm install

# Khởi chạy dev server
npm run dev
```

Ứng dụng frontend sẽ chạy tại cổng mặc định của Vite, thông thường là **http://localhost:5173**. Hãy mở trình duyệt truy cập đường dẫn này để trải nghiệm dự án.

---

## 🔒 Tài Khoản Demo Mặc Định
Để thuận tiện cho việc kiểm thử hệ thống mà không cần đăng ký tài khoản mới:

*   **Tài khoản Khách hàng (User):**
    *   Email: `customer@gmail.com`
    *   Mật khẩu: `password`
*   **Tài khoản Quản trị viên (Admin):**
    *   Email: `admin@gmail.com`
    *   Mật khẩu: `admin`

---

## 📝 Quy trình tích hợp Tìm kiếm AI (Google Gemini)
1. Khách hàng gửi câu hỏi/truy vấn từ thanh tìm kiếm.
2. API backend gửi yêu cầu kèm Prompt định hướng tới Gemini AI: *"Bạn là trợ lý bán hàng chuyên biệt cho cửa hàng Adidas. Hãy phân tích yêu cầu tìm kiếm của khách hàng và chuyển nó thành JSON..."*
3. Gemini AI phản hồi dạng chuỗi JSON chứa các bộ lọc: `keyword`, `minPrice`, `maxPrice`, `color`, `brand`, `size`.
4. Backend parse chuỗi JSON này, nạp vào JPA Specification để xây dựng câu lệnh SQL tìm kiếm động trên cơ sở dữ liệu MySQL và trả kết quả phân trang về cho client hiển thị.

---

## 🤖 Tích hợp n8n Workflow (Chatbot AI)
Dự án cung cấp sẵn cấu hình n8n Workflow tại file `My workflow 2.json` ở thư mục gốc để triển khai Chatbot AI tự động:
1. **Webhook**: Endpoint `/chat` nhận tin nhắn trò chuyện của khách hàng.
2. **AI Agent (Google Gemini)**: Sử dụng mô hình `gemini-2.5-flash` đóng vai trò là nhân viên tư vấn vui vẻ, thân thiện của cửa hàng Adidas.
3. **Logic phản hồi**: Phân tích danh sách sản phẩm và tự động trả về định dạng thẻ đặc biệt `[PRODUCT: ID|Tên|Giá|URL_Ảnh]` ở cuối câu trả lời để giao diện client (khung chat) render khung sản phẩm chi tiết và đẹp mắt, tăng trải nghiệm người dùng.

---

## 📄 Bản Quyền & Phát Triển
Dự án được xây dựng và hoàn thiện bởi **Sung-star** & **TuanVu** làm đồ án tốt nghiệp chuyên ngành Công nghệ thông tin.

**🏆 Chúc bạn có trải nghiệm tuyệt vời cùng SportingShop!**

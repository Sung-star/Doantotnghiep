package com.example.ecommerce.config;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.jdbc.core.JdbcTemplate;

import com.example.ecommerce.entities.Category;
import com.example.ecommerce.entities.Product;
import com.example.ecommerce.entities.ProductSize;
import com.example.ecommerce.entities.ProductVariant;
import com.example.ecommerce.entities.Role;
import com.example.ecommerce.entities.User;
import com.example.ecommerce.services.ProductService;
import com.example.ecommerce.repositories.CategoryRepository;
import com.example.ecommerce.repositories.OrderItemRepository;
import com.example.ecommerce.repositories.OrderRepository;
import com.example.ecommerce.repositories.ProductRepository;
import com.example.ecommerce.repositories.ProductSizeRepository;
import com.example.ecommerce.repositories.ProductVariantRepository;
import com.example.ecommerce.repositories.RoleRepository;
import com.example.ecommerce.repositories.UserRepository;
import com.example.ecommerce.repositories.ReviewRepository;

@Configuration
public class TestConfig implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private OrderRepository orderRepository;
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private ProductService productService;
    @Autowired private ProductSizeRepository productSizeRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private ProductVariantRepository productVariantRepository;
    @Autowired private ReviewRepository reviewRepository;

    private static final String ADIDAS_IMG = "data:image/jpeg;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAA8LAAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAB9AAAAfQAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQwMAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAA8LhtZGF0EgAKChsqvn/P4IEBAMIynuEDEcACCCCBQPS6zdIsaUKc+mlDMO46WCu183WP+DCYUHG5FiCDRjqMB8i/h1yAXFT7mxUQ/5PRfKffmC1477NBczv7tpJzRQg15gi8wZgbawLOQegPk6qehUo5ywNjFrb3/XG2kdzYv2Mm1t/2hwxMIKVp1JQR7Odb5+QJXbf+7kzZz4ZxChqAxRh1bFQWawClxiXk2tK0+7EITxuXTjT/pxjHAi3uGtri6lZlAdgOxL50Ds75NdV3fQzUXw0icNZ2//XgCLvjizL1343aYs/PhSkx6+q/fkA7sHna261LQR65VeO3zYb02+Gd4zojUy0GbWYXO7qizU+UWiQ1A2RzgmlKMcRy/czvJfSy2Y3BjqN0eZ1jypuOq7V+T0u1wTaXdq0LVTPlft/U5rLH2lelI73NI3YY4TtZACrF/pfhC8MaIibM557AIE6Bb1nCy9lRYHXDKCc7IesWNc8vMq58gMUWYlKxzp5gE1M1oz6N3yZObyddGt+6p1t64aQBvhwg99pwVUqwFw4jy3ppQul86PHn+fWv51cKqVZtP9lI6CUjmWx8zmOwsg/9+p9kKQ61T+noTAetoz/d2SGQjE9jjhjBufnVjGvDEEZTqdf3t11ZmAfgWaLELY+L7v5zLy2Qwa8CMRQV2Xgq7koPa7bbf9S0ltHOFeyieUZQa7Jw1xqI9kMyatWeY4OHsbe7GF1XlJ+tv+JuSHRT66fbdi1dkEcqnIlCleQKAkQILywvhGc0V9zoQUzJ5aJlZfXirlteFUNnou95bUVex5ZJCbLqNU9OWKLscg0Hoy6aeXd+rz8jBSQzBlRZf5QG0WgtGEcyKOPwYtHrNrDQ+/ci0JScYSzeWgsvGZD6Va9Fj+yyA/w95GNb6HCKcZ5z4G3lL777+iBQNzih+mb5fAhMwhFAIhDVIZ/ZHhy84QecD2qxBxFaBJi4grFnbMpyDFtdvX16*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";

    @Override
    public void run(String... args) throws Exception {
        // --- 1. DB UPGRADE (Luôn chạy để đảm bảo schema) ---
        try {
            jdbcTemplate.execute("ALTER TABLE tb_product MODIFY img_url LONGTEXT");
            jdbcTemplate.execute("ALTER TABLE tb_product_variant MODIFY img_url LONGTEXT");
            jdbcTemplate.execute("ALTER TABLE users MODIFY img_url LONGTEXT");
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN active BOOLEAN DEFAULT TRUE");
        } catch (Exception e) {}

        // --- KIỂM TRA DỮ LIỆU ---
        // Nếu đã có Admin rồi thì KHÔNG chạy seeding nữa để tránh ghi đè dữ liệu thủ công của bạn
        if (userRepository.count() > 0) {
            System.out.println(">>> Database đã có dữ liệu. Bỏ qua seeding.");
            return;
        }

        // --- 2. CLEANUP (Chỉ chạy khi DB trống và cần seed mới) ---
        System.out.println(">>> Đang khởi tạo dữ liệu mẫu lần đầu...");
        // jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0");
        // ... (Các lệnh TRUNCATE được bỏ qua để an toàn)
        
        // --- 3. ROLES & USERS ---
        Role adminRole = roleRepository.save(new Role(null, "ROLE_ADMIN"));
        Role clientRole = roleRepository.save(new Role(null, "ROLE_CLIENT"));
        String pw = passwordEncoder.encode("123456");
        User admin = new User(null, "Admin Adidas", "admin@gmail.com", "0912345678", pw);
        admin.getRoles().add(adminRole);
        userRepository.save(admin);

        // --- 4. HỆ THỐNG DANH MỤC CHUẨN ADIDAS ---
        Category shoes = createCat("GIÀY", "Tất cả các loại giày");
        Category clothing = createCat("QUẦN ÁO", "Tất cả quần áo thời trang");
        Category bottoms = createCat("QUẦN", "Quần dài và quần short");
        Category accessories = createCat("PHỤ KIỆN", "Tất, túi, găng tay");

        createSub(shoes, "Sneakers");
        Category running = createSub(shoes, "Chạy bộ");
        Category football = createSub(shoes, "Bóng đá");

        Category tshirts = createSub(clothing, "Áo thun (T-shirt)");
        createSub(clothing, "Hoodie");

        // --- 5. TẠO SẢN PHẨM MẪU ---
        seedProduct("Adidas Samba OG", "Biểu tượng đường phố.", 2700000.0, shoes, true, "Đen");
        seedProduct("Ultraboost Light", "Đệm Boost siêu nhẹ.", 5000000.0, running, true, "Trắng");
        seedProduct("Predator Accuracy", "Kiểm soát bóng tuyệt đối.", 6500000.0, football, true, "Cam");
        seedProduct("Áo thun Essentials Logo", "Phong cách tối giản.", 550000.0, tshirts, false, "Trắng");

        System.out.println("✅ Hệ thống đã sẵn sàng với dữ liệu mẫu ban đầu!");
    }

    private Category createCat(String name, String desc) {
        return categoryRepository.save(new Category(null, name, desc));
    }

    private Category createSub(Category parent, String name) {
        Category sub = new Category(null, name, "Thuộc " + parent.getName());
        sub.setParent(parent);
        return categoryRepository.save(sub);
    }

    private void seedProduct(String name, String desc, Double price, Category cat, boolean isShoe, String color) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(desc);
        p.setPrice(price);
        p.setBrand("Adidas");
        p.setImgUrl(ADIDAS_IMG);
        if (cat != null) p.getCategories().add(cat);
        
        p = productService.insert(p);

        ProductVariant v = p.getVariants().iterator().next();
        v.setColor(color);
        v = productVariantRepository.save(v);

        List<ProductSize> sizes = new ArrayList<>();
        if (isShoe) {
            for (int s = 38; s <= 44; s++) {
                sizes.add(new ProductSize(null, String.valueOf(s), 50, v));
            }
        } else {
            for (String s : Arrays.asList("S", "M", "L", "XL")) {
                sizes.add(new ProductSize(null, s, 100, v));
            }
        }
        productSizeRepository.saveAll(sizes);
    }
}
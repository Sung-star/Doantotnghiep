package com.example.ecommerce.config;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.ecommerce.entities.Category;
import com.example.ecommerce.entities.Order;
import com.example.ecommerce.entities.OrderItem;
import com.example.ecommerce.entities.Payment;
import com.example.ecommerce.entities.Product;
import com.example.ecommerce.entities.ProductSize;
import com.example.ecommerce.entities.Role;
import com.example.ecommerce.entities.User;
import com.example.ecommerce.entities.enums.OrderStatus;
import com.example.ecommerce.repositories.CategoryRepository;
import com.example.ecommerce.repositories.OrderItemRepository;
import com.example.ecommerce.repositories.OrderRepository;
import com.example.ecommerce.repositories.ProductRepository;
import com.example.ecommerce.repositories.ProductSizeRepository;
import com.example.ecommerce.repositories.RoleRepository;
import com.example.ecommerce.repositories.UserRepository;

@Configuration
@Profile("test")
public class TestConfig implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    private final Random random = new Random();
    private static final String BRAND = "Adidas";

    // ===================== DỮ LIỆU SẢN PHẨM ADIDAS =====================

    private final String[][] PRODUCT_DATA = {
        // { tên sản phẩm, danh mục gợi ý }
        // Giày
        {"Ultraboost 22", "Giày Chạy Bộ"},
        {"Ultraboost Light", "Giày Chạy Bộ"},
        {"Solarboost 5", "Giày Chạy Bộ"},
        {"Adizero Adios Pro 3", "Giày Chạy Bộ"},
        {"NMD_R1", "Giày Lifestyle"},
        {"Stan Smith", "Giày Lifestyle"},
        {"Superstar", "Giày Lifestyle"},
        {"Gazelle", "Giày Lifestyle"},
        {"Forum Low", "Giày Lifestyle"},
        {"Predator Accuracy.3", "Giày Bóng Đá"},
        {"Copa Pure.1", "Giày Bóng Đá"},
        {"X Speedportal.1", "Giày Bóng Đá"},
        {"Predator Club TF", "Giày Bóng Đá"},
        {"Nemeziz 19.1", "Giày Bóng Đá"},
        {"Harden Vol.7", "Giày Bóng Rổ"},
        {"D.O.N. Issue 5", "Giày Bóng Rổ"},
        {"Adizero Cybersonic", "Giày Tennis"},
        {"Barricade 13", "Giày Tennis"},
        {"Terrex Swift R3", "Giày Outdoor"},
        {"Terrex Trailmaker", "Giày Outdoor"},
        // Trang phục nam
        {"Áo Thun Essentials 3-Stripes", "Trang Phục Nam"},
        {"Áo Polo Adicross", "Trang Phục Nam"},
        {"Áo Khoác Tiro 23 League", "Trang Phục Nam"},
        {"Áo Khoác Windbreaker Terrex", "Trang Phục Nam"},
        {"Quần Jogger Essentials", "Trang Phục Nam"},
        {"Quần Short Squadra 21", "Trang Phục Nam"},
        {"Áo Hoodie Originals Trefoil", "Trang Phục Nam"},
        {"Quần Track Pants 3-Stripes", "Trang Phục Nam"},
        {"Áo Training HEAT.RDY", "Trang Phục Nam"},
        {"Áo Đấu Bayern Munich 23/24", "Trang Phục Nam"},
        // Trang phục nữ
        {"Áo Thun Lounge Ribbed", "Trang Phục Nữ"},
        {"Áo Crop Designed To Move", "Trang Phục Nữ"},
        {"Quần Legging Believe This", "Trang Phục Nữ"},
        {"Quần Short Run Icons", "Trang Phục Nữ"},
        {"Áo Khoác Slim Cuff", "Trang Phục Nữ"},
        {"Váy Tennis Premium", "Trang Phục Nữ"},
        {"Bộ Thể Thao Yoga Studio", "Trang Phục Nữ"},
        {"Áo Hoodie Essentials Linear", "Trang Phục Nữ"},
        {"Quần Jogger All SZN Fleece", "Trang Phục Nữ"},
        {"Áo Bra Training Powerimpact", "Trang Phục Nữ"},
        // Trang phục trẻ em
        {"Áo Thun Essentials Trẻ Em", "Trang Phục Trẻ Em"},
        {"Quần Short Aeroready Trẻ Em", "Trang Phục Trẻ Em"},
        {"Áo Khoác Colorblock Trẻ Em", "Trang Phục Trẻ Em"},
        {"Giày Tensaur Sport Trẻ Em", "Trang Phục Trẻ Em"},
        {"Bộ Thể Thao Entrada Trẻ Em", "Trang Phục Trẻ Em"},
        // Phụ kiện
        {"Mũ Lưỡi Trai Classic", "Phụ Kiện"},
        {"Túi Balo Classic Backpack", "Phụ Kiện"},
        {"Túi Gym Duffel", "Phụ Kiện"},
        {"Tất 3 Đôi No-Show", "Phụ Kiện"},
        {"Vớ Thể Thao Cushioned Crew", "Phụ Kiện"},
        {"Bóng Đá Tiro League", "Phụ Kiện"},
        {"Bóng Đá Champions League", "Phụ Kiện"},
        {"Bình Nước Stainless Steel", "Phụ Kiện"},
        {"Đồng Hồ Sport Chrono", "Phụ Kiện"},
        {"Băng Đầu AEROREADY", "Phụ Kiện"},
        // Thiết bị tập luyện
        {"Thảm Yoga Adidas Premium", "Thiết Bị Tập Luyện"},
        {"Dây Kháng Lực Resistance Band", "Thiết Bị Tập Luyện"},
        {"Cân Điện Tử Smart Scale", "Thiết Bị Tập Luyện"},
        {"Vớt Tennis Feather", "Thiết Bị Tập Luyện"},
        {"Găng Tay Boxing Speed", "Thiết Bị Tập Luyện"},
        // Bộ sưu tập Originals
        {"Áo Khoác Track Jacket SST", "Adidas Originals"},
        {"Quần Track Pant Firebird", "Adidas Originals"},
        {"Áo Hoodie Adicolor Classic", "Adidas Originals"},
        {"Quần Short Adicolor 3-Stripes", "Adidas Originals"},
        {"Áo Thun Originals Trefoil", "Adidas Originals"},
        // Bộ sưu tập Performance
        {"Áo Đấu Manchester United 23/24", "Adidas Performance"},
        {"Áo Đấu Real Madrid 23/24", "Adidas Performance"},
        {"Áo Đấu Tuyển Đức 2024", "Adidas Performance"},
        {"Quần Short Training Tabela 23", "Adidas Performance"},
        {"Áo Goalkeeper Jersey", "Adidas Performance"},
        // Thêm sản phẩm đa dạng
        {"Ultraboost 23 Heat.RDY", "Giày Chạy Bộ"},
        {"Adizero Prime X", "Giày Chạy Bộ"},
        {"Handball Spezial", "Giày Lifestyle"},
        {"Samba OG", "Giày Lifestyle"},
        {"Quần Áo Golf Primegreen", "Trang Phục Nam"},
        {"Áo Khoác Golf 5-Pocket", "Trang Phục Nam"},
        {"Quần Legging Yoga", "Trang Phục Nữ"},
        {"Áo Thun Tennis Heat.RDY", "Trang Phục Nữ"},
        {"Túi Mini Shoulder Bag", "Phụ Kiện"},
        {"Nón Bucket Reversible", "Phụ Kiện"},
        {"Áo Phao Helionic Vest", "Adidas Originals"},
        {"Áo Len COLD.RDY", "Adidas Originals"},
        {"Giày Bóng Chuyền Ligra 7", "Giày Lifestyle"},
        {"Giày Cầu Lông Adizero", "Giày Lifestyle"},
        {"Bộ Đồ Bơi Infinitex", "Trang Phục Nữ"},
        {"Mũ Bơi Silicone 3S", "Phụ Kiện"},
        {"Giày Chạy Bộ Duramo 10", "Giày Chạy Bộ"},
        {"Áo Khoác Rain.RDY", "Trang Phục Nam"},
        {"Quần Short Parma 16", "Adidas Performance"},
        {"Giày Sandbox Classic", "Giày Lifestyle"},
    };

    private final String[] ADIDAS_COLORS = {
        "Core Black", "Cloud White", "Legend Ink", "Vivid Red",
        "Pulse Mint", "Solar Orange", "Sky Rush", "Collegiate Navy",
        "Linen Green", "Wonder Mauve"
    };

    private final String[] IMAGE_URLS = {
        "https://images.unsplash.com/photo-1542291026-7eec264c27ab?w=800&auto=format&fit=crop", // Giày thể thao
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop", // Giày chạy bộ
        "https://images.unsplash.com/photo-1556906781-9a412961a28f?w=800&auto=format&fit=crop", // Sneaker lifestyle
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&auto=format&fit=crop", // Áo thể thao
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop", // Thời trang thể thao
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&auto=format&fit=crop", // Bộ thể thao
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop", // Gym
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop", // Sneakers
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop", // Bóng đá
        "https://images.unsplash.com/photo-1552674605-db6ffd5e259b?w=800&auto=format&fit=crop", // Dụng cụ tập luyện
    };

    // ===================== PHƯƠNG THỨC CHÍNH =====================

    @Override
    public void run(String... args) throws Exception {

        // 0. TẠO QUYỀN (ROLES)
        Role adminRole = new Role(null, "ROLE_ADMIN");
        Role clientRole = new Role(null, "ROLE_CLIENT");
        roleRepository.saveAll(Arrays.asList(adminRole, clientRole));
        System.out.println("✅ Đã tạo Roles");

        // 1. MÃ HÓA MẬT KHẨU
        String passwordEncoded = passwordEncoder.encode("123456");

        // 2. TẠO NGƯỜI DÙNG
        User admin = new User(null, "Tạ Văn Hoài Sung", "admin@adidas-store.vn", "0912345678", passwordEncoded);
        admin.getRoles().add(adminRole);

        User customer1 = new User(null, "Trần Thị Lan Anh", "lananh@gmail.com", "0987654321", passwordEncoded);
        customer1.getRoles().add(clientRole);

        User customer2 = new User(null, "Phạm Văn Minh", "phamvanminh@gmail.com", "0901234567", passwordEncoded);
        customer2.getRoles().add(clientRole);

        userRepository.saveAll(Arrays.asList(admin, customer1, customer2));
        System.out.println("✅ Đã tạo Users");

        // 3. DANH MỤC SẢN PHẨM ADIDAS
        Category catShoeRunning   = new Category(null, "Giày Chạy Bộ",        "Giày chạy bộ Adidas: Ultraboost, Solarboost, Adizero và nhiều hơn nữa.");
        Category catShoeFootball  = new Category(null, "Giày Bóng Đá",        "Giày đá bóng Adidas: Predator, Copa, X Speedportal cho sân cỏ và sân nhân tạo.");
        Category catShoeLifestyle = new Category(null, "Giày Lifestyle",       "Giày Adidas thường ngày: Stan Smith, Superstar, NMD, Samba, Gazelle.");
        Category catMen           = new Category(null, "Trang Phục Nam",       "Áo, quần, áo khoác Adidas dành cho nam.");
        Category catWomen         = new Category(null, "Trang Phục Nữ",        "Áo, quần, bộ thể thao Adidas dành cho nữ.");
        Category catKids          = new Category(null, "Trang Phục Trẻ Em",    "Quần áo và giày Adidas dành cho trẻ em.");
        Category catAccessories   = new Category(null, "Phụ Kiện",             "Balo, túi, mũ, tất và phụ kiện thể thao Adidas.");
        Category catEquipment     = new Category(null, "Thiết Bị Tập Luyện",   "Dụng cụ tập luyện mang thương hiệu Adidas.");
        Category catOriginals     = new Category(null, "Adidas Originals",     "Bộ sưu tập Originals – thời trang đường phố mang biểu tượng ba sọc.");
        Category catPerformance   = new Category(null, "Adidas Performance",   "Trang phục thi đấu chuyên nghiệp và áo đấu câu lạc bộ bóng đá.");

        List<Category> categories = categoryRepository.saveAll(Arrays.asList(
                catShoeRunning, catShoeFootball, catShoeLifestyle,
                catMen, catWomen, catKids,
                catAccessories, catEquipment,
                catOriginals, catPerformance
        ));
        System.out.println("✅ Đã tạo " + categories.size() + " danh mục");

        // Tạo map để tra cứu nhanh theo tên
        java.util.Map<String, Category> catMap = new java.util.HashMap<>();
        for (Category c : categories) catMap.put(c.getName(), c);

        // 4. TẠO SẢN PHẨM ADIDAS
        System.out.println("⏳ Đang tạo sản phẩm Adidas...");
        List<Product> products = new ArrayList<>();

        for (String[] data : PRODUCT_DATA) {
            String name        = data[0];
            String catHint     = data[1];
            String color       = ADIDAS_COLORS[random.nextInt(ADIDAS_COLORS.length)];
            String description = buildDescription(name);
            double price       = generatePrice(catHint);
            String imageUrl    = IMAGE_URLS[random.nextInt(IMAGE_URLS.length)];

            Product p = new Product(null, name, description, price, color, BRAND, imageUrl);

            Category cat = catMap.getOrDefault(catHint, catOriginals);
            p.getCategories().add(cat);

            // Giày chạy bộ cũng thuộc Performance
            if (catHint.equals("Giày Chạy Bộ") || catHint.equals("Giày Bóng Đá")) {
                p.getCategories().add(catPerformance);
            }

            products.add(p);
        }

        List<Product> savedProducts = productRepository.saveAll(products);
        System.out.println("✅ Đã tạo " + savedProducts.size() + " sản phẩm Adidas");

        // 5. TẠO SIZE CHO SẢN PHẨM
        System.out.println("⏳ Đang tạo dữ liệu Size...");
        List<ProductSize> listSizes = new ArrayList<>();
        String[] clothingSizes = {"XS", "S", "M", "L", "XL", "XXL"};

        for (Product p : savedProducts) {
            boolean isShoe = p.getCategories().stream()
                    .anyMatch(cat -> cat.getName().toLowerCase().contains("giày"));

            if (isShoe) {
                // Size giày từ 36 đến 47
                for (int sz = 36; sz <= 47; sz++) {
                    int qty = 3 + random.nextInt(18); // 3–20 đôi
                    listSizes.add(new ProductSize(null, qty, String.valueOf(sz), p));
                }
            } else {
                // Size quần áo / phụ kiện
                for (String sName : clothingSizes) {
                    int qty = 5 + random.nextInt(46); // 5–50 cái
                    listSizes.add(new ProductSize(null, qty, sName, p));
                }
            }
        }
        productSizeRepository.saveAll(listSizes);
        System.out.println("✅ Đã tạo Size cho " + savedProducts.size() + " sản phẩm");

        // 6. ĐƠN HÀNG MẪU
        Order order1 = new Order(null, Instant.parse("2024-10-15T09:00:00Z"), OrderStatus.PAID,            customer1);
        Order order2 = new Order(null, Instant.parse("2024-11-02T14:20:00Z"), OrderStatus.WAITING_PAYMENT, customer2);
        Order order3 = new Order(null, Instant.parse("2024-12-20T18:45:00Z"), OrderStatus.PAID,            customer1);
        orderRepository.saveAll(Arrays.asList(order1, order2, order3));

        // 7. CHI TIẾT ĐƠN HÀNG
        OrderItem oi1 = new OrderItem(order1, savedProducts.get(0),  1, savedProducts.get(0).getPrice());  // Ultraboost 22
        OrderItem oi2 = new OrderItem(order1, savedProducts.get(20), 2, savedProducts.get(20).getPrice()); // Áo Essentials Nam
        OrderItem oi3 = new OrderItem(order2, savedProducts.get(9),  1, savedProducts.get(9).getPrice());  // Predator Accuracy
        OrderItem oi4 = new OrderItem(order3, savedProducts.get(30), 1, savedProducts.get(30).getPrice()); // Áo Nữ
        OrderItem oi5 = new OrderItem(order3, savedProducts.get(45), 3, savedProducts.get(45).getPrice()); // Phụ kiện
        orderItemRepository.saveAll(Arrays.asList(oi1, oi2, oi3, oi4, oi5));

        // 8. THANH TOÁN
        Payment pay1 = new Payment(null, Instant.parse("2024-10-15T09:10:00Z"), order1);
        order1.setPayment(pay1);
        orderRepository.save(order1);

        Payment pay3 = new Payment(null, Instant.parse("2024-12-20T18:55:00Z"), order3);
        order3.setPayment(pay3);
        orderRepository.save(order3);

        System.out.println("✅ Đã tạo dữ liệu test cho Sporting Shop thành công!");
        System.out.println("   → " + savedProducts.size() + " sản phẩm | " + categories.size() + " danh mục | 3 đơn hàng");
    }

    // ===================== HELPER METHODS =====================

    /**
     * Sinh mô tả sản phẩm phù hợp với tên.
     */
    private String buildDescription(String productName) {
        String lower = productName.toLowerCase();
        if (lower.contains("ultraboost") || lower.contains("adizero") || lower.contains("solarboost") || lower.contains("duramo")) {
            return "Giày chạy bộ Adidas " + productName + " với công nghệ đệm Boost mang lại cảm giác êm ái, trả năng lượng tối ưu cho từng bước chân. " +
                   "Đế ngoài Continental™ cho độ bám tốt trên mọi địa hình.";
        }
        if (lower.contains("predator") || lower.contains("copa") || lower.contains("speedportal") || lower.contains("nemeziz")) {
            return "Giày đá bóng Adidas " + productName + " với lớp mặt trên chuyên biệt giúp kiểm soát bóng vượt trội. " +
                   "Đế Firm Ground/Turf tối ưu cho các mặt sân phổ biến.";
        }
        if (lower.contains("stan smith") || lower.contains("superstar") || lower.contains("samba") || lower.contains("gazelle") || lower.contains("forum") || lower.contains("nmd")) {
            return "Giày thời trang Adidas " + productName + " – biểu tượng sneaker mang ba sọc huyền thoại. " +
                   "Thiết kế kinh điển, phù hợp với mọi phong cách ăn mặc hàng ngày.";
        }
        if (lower.contains("áo hoodie") || lower.contains("áo khoác") || lower.contains("track jacket")) {
            return "Áo khoác/hoodie Adidas " + productName + " từ chất liệu French Terry cotton mềm mại, ấm áp. " +
                   "Logo Adidas thêu nổi, phong cách sporty casual dễ phối đồ.";
        }
        if (lower.contains("áo thun") || lower.contains("áo polo") || lower.contains("áo training") || lower.contains("áo bra")) {
            return "Áo thể thao Adidas " + productName + " với công nghệ AEROREADY/Climalite thấm hút mồ hôi nhanh, " +
                   "giúp cơ thể luôn khô thoáng trong suốt buổi tập.";
        }
        if (lower.contains("quần legging") || lower.contains("quần jogger") || lower.contains("quần short") || lower.contains("quần track")) {
            return "Quần thể thao Adidas " + productName + " co giãn 4 chiều, ôm sát cơ thể, " +
                   "tối ưu cho các buổi tập cường độ cao, yoga hay chạy bộ nhẹ nhàng.";
        }
        if (lower.contains("balo") || lower.contains("túi") || lower.contains("mũ") || lower.contains("tất") || lower.contains("vớ") || lower.contains("băng đầu") || lower.contains("nón")) {
            return "Phụ kiện thể thao Adidas " + productName + " – thiết kế tiện dụng, bền bỉ, " +
                   "mang đậm phong cách thể thao đặc trưng của thương hiệu ba sọc.";
        }
        if (lower.contains("originals") || lower.contains("firebird") || lower.contains("adicolor") || lower.contains("sst")) {
            return "Sản phẩm Adidas Originals " + productName + " – lấy cảm hứng từ di sản thể thao, " +
                   "mang biểu tượng Trefoil lên trang phục đường phố đương đại.";
        }
        if (lower.contains("áo đấu") || lower.contains("manchester") || lower.contains("real madrid") || lower.contains("tuyển đức")) {
            return "Áo đấu chính hãng Adidas " + productName + " phiên bản Fan Edition. " +
                   "Chất liệu AEROREADY nhẹ, thoáng khí, cảm giác mặc thoải mái cả ngày.";
        }
        // Mặc định
        return "Sản phẩm Adidas " + productName + " – chất lượng đẳng cấp thế giới, kết hợp công nghệ tiên tiến và thiết kế thể thao hiện đại. " +
               "Thương hiệu ba sọc – Impossible Is Nothing.";
    }

    /**
     * Sinh giá hợp lý theo danh mục sản phẩm (VND).
     */
    private double generatePrice(String category) {
        double min, max;
        switch (category) {
            case "Giày Chạy Bộ":       min = 2_500_000; max = 7_500_000; break;
            case "Giày Bóng Đá":       min = 1_200_000; max = 5_000_000; break;
            case "Giày Lifestyle":     min = 1_500_000; max = 4_500_000; break;
            case "Trang Phục Nam":     min = 400_000;   max = 2_200_000; break;
            case "Trang Phục Nữ":     min = 400_000;   max = 2_200_000; break;
            case "Trang Phục Trẻ Em": min = 300_000;   max = 1_500_000; break;
            case "Phụ Kiện":           min = 150_000;   max = 1_200_000; break;
            case "Thiết Bị Tập Luyện": min = 200_000;   max = 3_000_000; break;
            case "Adidas Originals":   min = 800_000;   max = 3_500_000; break;
            case "Adidas Performance": min = 600_000;   max = 2_800_000; break;
            default:                   min = 500_000;   max = 3_000_000; break;
        }
        double price = min + random.nextDouble() * (max - min);
        return Math.round(price / 1000.0) * 1000.0; 
    }
}
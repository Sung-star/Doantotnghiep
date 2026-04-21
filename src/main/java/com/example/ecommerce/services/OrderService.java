package com.example.ecommerce.services;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ecommerce.dto.CartItemDTO;
import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.entities.Order;
import com.example.ecommerce.entities.OrderItem;
import com.example.ecommerce.entities.Payment;
import com.example.ecommerce.entities.ProductSize;
import com.example.ecommerce.entities.ProductVariant;
import com.example.ecommerce.entities.User;
import com.example.ecommerce.entities.Voucher;
import com.example.ecommerce.entities.enums.OrderStatus;
import com.example.ecommerce.repositories.OrderItemRepository;
import com.example.ecommerce.repositories.OrderRepository;
import com.example.ecommerce.repositories.ProductSizeRepository;
import com.example.ecommerce.repositories.ProductVariantRepository;
import com.example.ecommerce.repositories.UserRepository;
import com.example.ecommerce.repositories.VoucherRepository;
import com.example.ecommerce.services.exceptions.BadRequestException;


@Service
public class OrderService {

    @Autowired
    private OrderRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    public List<Order> findAll() {
        return repository.findAll();
    }

    public Order findById(Long id) {
        Optional<Order> obj = repository.findById(id);
        return obj.orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + id));
    }

    @Transactional
    public void delete(Long id) {
        try {
            Order order = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại!"));
            repository.delete(order);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi xóa đơn hàng: " + e.getMessage());
        }
    }

    @Transactional
    public Order updateStatus(Long id, OrderStatus status) {
        Order order = repository.findById(id).orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        order.setOrderStatus(status);
        if (status == OrderStatus.PAID && order.getPayment() == null) {
            Payment pay = new Payment(null, Instant.now(), order);
            order.setPayment(pay);
        }
        return repository.save(order);
    }

    // --- ĐẶT HÀNG MỚI (LOGIC MỚI: DÙNG TÊN SIZE DẠNG STRING) ---
    @Transactional
    public Order placeOrder(OrderDTO dto) {
        // 1. Tìm khách hàng
        User client = userRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại!"));

        // 2. Khởi tạo đơn hàng mới
        Order order = new Order(null, Instant.now(), OrderStatus.WAITING_PAYMENT, client);
        
        // Lưu thông tin giao hàng
        order.setShippingName(dto.getShippingName());
        order.setShippingPhone(dto.getShippingPhone());
        order.setShippingAddress(dto.getShippingAddress());

        // Tính phí vận chuyển (đơn giản: fixed 30k cho HN, 50k cho tỉnh)
        double shippingFee = calculateShippingFee(dto.getShippingAddress());
        order.setShippingFee(shippingFee);

        // Áp dụng voucher nếu có
        if (dto.getVoucherCode() != null && !dto.getVoucherCode().trim().isEmpty()) {
            Voucher voucher = voucherRepository.findActiveByCode(dto.getVoucherCode().trim())
                    .orElseThrow(() -> new BadRequestException("Mã giảm giá không hợp lệ hoặc đã hết hạn!"));
            order.setVoucherCode(dto.getVoucherCode());
            // Discount sẽ tính sau khi có tổng tiền, nhưng tạm set 0
            order.setDiscountAmount(0.0);
        }

        // Lưu Order trước để có ID
        order = repository.save(order);

        // 3. Xử lý từng sản phẩm & TRỪ KHO
        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new BadRequestException("Giỏ hàng đang trống!");
        }

        for (CartItemDTO itemDto : dto.getItems()) {
            // A. TÌM ĐÚNG VARIANT (màu) trước
            ProductVariant variant = productVariantRepository.findByProductAndColor(itemDto.getProductId(), itemDto.getColor())
                    .orElseThrow(() -> new BadRequestException("Sản phẩm với màu " + itemDto.getColor() + " không tồn tại!"));

            // B. TÌM ĐÚNG SIZE trong variant đó
            ProductSize productSize = productSizeRepository.findByVariantAndSize(variant.getId(), itemDto.getSizeName())
                    .orElseThrow(() -> new BadRequestException("Sản phẩm (màu: " + itemDto.getColor() + ") với Size (" + itemDto.getSizeName() + ") không tồn tại hoặc đã hết hàng!"));

            // C. KIỂM TRA TỒN KHO
            if (productSize.getQuantity() < itemDto.getQuantity()) {
                throw new BadRequestException("Sản phẩm " + variant.getProduct().getName() 
                        + " - Màu " + variant.getColor() 
                        + " - Size " + productSize.getSize() 
                        + " không đủ hàng! (Còn lại: " + productSize.getQuantity() + ")");
            }

            // D. TRỪ KHO VÀ LƯU LẠI
            productSize.setQuantity(productSize.getQuantity() - itemDto.getQuantity());
            productSizeRepository.save(productSize); // Cập nhật số lượng mới vào DB

            // E. TẠO ORDER ITEM
            double itemPrice = variant.getProduct().getPrice();
            OrderItem item = new OrderItem(order, variant.getProduct(), itemDto.getQuantity(), itemPrice);
            
            // Lưu tên Size (String) vào chi tiết đơn hàng
            item.setSize(productSize.getSize()); 

            orderItemRepository.save(item);
        }

        // Tính lại discount sau khi có items
        if (order.getVoucherCode() != null) {
            Voucher voucher = voucherRepository.findActiveByCode(order.getVoucherCode())
                    .orElseThrow(() -> new RuntimeException("Voucher không còn hợp lệ!"));
            double discount = calculateDiscount(order, voucher);
            order.setDiscountAmount(discount);
            repository.save(order); // Update discount
        }

        return repository.save(order);
    }

    private double calculateShippingFee(String address) {
        if (address == null) return 50000.0; // Default
        String addr = address.toLowerCase();
        if (addr.contains("hà nội") || addr.contains("hn")) {
            return 30000.0;
        } else {
            return 50000.0;
        }
    }

    private double calculateDiscount(Order order, Voucher voucher) {
        double subtotal = order.getItems().stream()
                .mapToDouble(item -> item.getSubTotal() != null ? item.getSubTotal() : 0.0)
                .sum();

        if (subtotal < voucher.getMinOrderAmount()) {
            throw new BadRequestException("Đơn hàng chưa đạt giá trị tối thiểu để áp dụng voucher!");
        }

        double discount = subtotal * (voucher.getDiscountPercent() / 100.0);
        if (voucher.getMaxDiscountAmount() != null) {
            discount = Math.min(discount, voucher.getMaxDiscountAmount());
        }
        return discount;
    }
}
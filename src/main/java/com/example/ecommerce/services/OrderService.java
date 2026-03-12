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
import com.example.ecommerce.entities.User;
import com.example.ecommerce.entities.enums.OrderStatus;
import com.example.ecommerce.repositories.OrderItemRepository;
import com.example.ecommerce.repositories.OrderRepository;
import com.example.ecommerce.repositories.ProductSizeRepository;
import com.example.ecommerce.repositories.UserRepository;

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

        // Lưu Order trước để có ID
        order = repository.save(order);

        // 3. Xử lý từng sản phẩm & TRỪ KHO
        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng đang trống!");
        }

        for (CartItemDTO itemDto : dto.getItems()) {
            // A. TÌM ĐÚNG SẢN PHẨM + TÊN SIZE (Dùng hàm mới trong Repository)
            // itemDto.getSizeName() trả về String (VD: "M", "L")
            ProductSize productSize = productSizeRepository.findByProductAndSize(itemDto.getProductId(), itemDto.getSizeName())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm (ID: " + itemDto.getProductId() + ") với Size (" + itemDto.getSizeName() + ") không tồn tại hoặc đã hết hàng!"));

            // B. KIỂM TRA TỒN KHO
            if (productSize.getQuantity() < itemDto.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + productSize.getProduct().getName() 
                        + " - Size " + productSize.getSize() 
                        + " không đủ hàng! (Còn lại: " + productSize.getQuantity() + ")");
            }

            // C. TRỪ KHO VÀ LƯU LẠI
            productSize.setQuantity(productSize.getQuantity() - itemDto.getQuantity());
            productSizeRepository.save(productSize); // Cập nhật số lượng mới vào DB

            // D. TẠO ORDER ITEM
            OrderItem item = new OrderItem(order, productSize.getProduct(), itemDto.getQuantity(), productSize.getProduct().getPrice());
            
            // Lưu tên Size (String) vào chi tiết đơn hàng
            item.setSize(productSize.getSize()); 

            orderItemRepository.save(item);
            order.getItems().add(item); 
        }

        // 4. Lưu lần cuối
        return repository.save(order);
    }
}
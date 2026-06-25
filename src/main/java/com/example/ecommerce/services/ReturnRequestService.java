package com.example.ecommerce.services;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ecommerce.entities.Order;
import com.example.ecommerce.entities.OrderItem;
import com.example.ecommerce.entities.ProductSize;
import com.example.ecommerce.entities.ReturnRequest;
import com.example.ecommerce.entities.enums.OrderStatus;
import com.example.ecommerce.entities.enums.ReturnStatus;
import com.example.ecommerce.repositories.OrderRepository;
import com.example.ecommerce.repositories.ProductSizeRepository;
import com.example.ecommerce.repositories.ReturnRequestRepository;
import com.example.ecommerce.services.exceptions.BadRequestException;
import com.example.ecommerce.services.exceptions.ResourceNotFoundException;

@Service
public class ReturnRequestService {

    @Autowired
    private ReturnRequestRepository repository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Autowired
    private LoyaltyService loyaltyService;

    @Autowired
    private EmailService emailService;

    public List<ReturnRequest> findAll() {
        return repository.findAll();
    }

    public ReturnRequest findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Yêu cầu trả hàng không tồn tại với ID: " + id));
    }

    public Optional<ReturnRequest> findByOrderId(Long orderId) {
        return repository.findByOrderId(orderId);
    }

    @Transactional
    public ReturnRequest createRequest(Long orderId, String reason, String type) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại với ID: " + orderId));

        if (repository.findByOrderId(orderId).isPresent()) {
            throw new BadRequestException("Đơn hàng này đã có yêu cầu trả hàng/đổi hàng!");
        }

        // Đơn hàng phải ở trạng thái DELIVERED hoặc COMPLETED mới cho phép trả hàng
        OrderStatus orderStatus = order.getOrderStatus();
        if (orderStatus != OrderStatus.DELIVERED && orderStatus != OrderStatus.COMPLETED) {
            throw new BadRequestException("Chỉ có thể hoàn trả đơn hàng đã giao hoặc hoàn tất!");
        }

        ReturnRequest request = new ReturnRequest();
        request.setOrder(order);
        request.setReason(reason);
        request.setType(type.toUpperCase());
        request.setStatus(ReturnStatus.PENDING);
        request.setCreatedAt(Instant.now());

        return repository.save(request);
    }

    @Transactional
    public ReturnRequest approveRequest(Long id) {
        ReturnRequest request = findById(id);
        if (request.getStatus() != ReturnStatus.PENDING) {
            throw new BadRequestException("Yêu cầu trả hàng không ở trạng thái chờ duyệt!");
        }

        Order order = request.getOrder();
        double refundAmt = order.getTotal();
        request.setRefundAmount(refundAmt);
        request.setStatus(ReturnStatus.APPROVED);

        // 1. Hoàn kho: Cộng lại số lượng sản phẩm vào ProductSize
        for (OrderItem item : order.getItems()) {
            List<ProductSize> sizes = productSizeRepository.findAllByProductAndSize(item.getProduct().getId(), item.getSize());
            if (!sizes.isEmpty()) {
                // Phân bổ hoàn kho vào size đầu tiên tìm thấy
                ProductSize size = sizes.get(0);
                size.setQuantity(size.getQuantity() + item.getQuantity());
                productSizeRepository.save(size);
            }
        }

        if ("RETURN".equals(request.getType())) {
            // 2. Hoàn điểm loyalty đã kiếm được từ đơn hàng này (Deduct/Refund points)
            double orderSubtotal = order.getItems().stream()
                    .mapToDouble(item -> item.getPrice() * item.getQuantity())
                    .sum();
            try {
                loyaltyService.refundPoints(order.getClient().getId(), orderSubtotal);
            } catch (Exception e) {
                System.err.println(">>> [LOYALTY] Lỗi khi trừ điểm đã kiếm: " + e.getMessage());
            }

            // 3. Hoàn điểm loyalty đã dùng khi thanh toán đơn hàng này (Add points back)
            Integer pointsUsed = order.getPointsUsed();
            if (pointsUsed != null && pointsUsed > 0) {
                try {
                    loyaltyService.adminAdjustPoints(
                        order.getClient().getId(), 
                        pointsUsed.longValue(), 
                        "Hoàn điểm sử dụng cho đơn hàng #" + order.getId()
                    );
                } catch (Exception e) {
                    System.err.println(">>> [LOYALTY] Lỗi khi hoàn điểm đã dùng: " + e.getMessage());
                }
            }

            // 4. Cập nhật trạng thái đơn hàng -> REFUNDED
            order.setOrderStatus(OrderStatus.REFUNDED);
            orderRepository.save(order);

            // 5. Gửi email thông báo hoàn tiền
            try {
                emailService.sendRefundNotification(order, refundAmt, "PENDING_CONFIRMATION");
            } catch (Exception e) {
                System.err.println(">>> [EMAIL] Lỗi gửi mail hoàn tiền: " + e.getMessage());
            }
        } else if ("EXCHANGE".equals(request.getType())) {
            // Đối với EXCHANGE (Đổi hàng), chỉ hoàn kho, không hoàn tiền, không hoàn điểm loyalty.
            // Có thể đổi thẳng trạng thái yêu cầu hoàn trả thành REFUND_COMPLETED.
            request.setStatus(ReturnStatus.REFUND_COMPLETED);
            request.setRefundAmount(0.0);
            request.setRefundMethod("CASH");
            request.setRefundNote("Yêu cầu đổi hàng - Đã hoàn kho sản phẩm cũ.");
        }

        return repository.save(request);
    }

    @Transactional
    public ReturnRequest rejectRequest(Long id) {
        ReturnRequest request = findById(id);
        if (request.getStatus() != ReturnStatus.PENDING) {
            throw new BadRequestException("Yêu cầu trả hàng không ở trạng thái chờ duyệt!");
        }

        request.setStatus(ReturnStatus.REJECTED);
        return repository.save(request);
    }

    @Transactional
    public ReturnRequest confirmRefund(Long id, String method, String note) {
        ReturnRequest request = findById(id);
        if (request.getStatus() != ReturnStatus.APPROVED) {
            throw new BadRequestException("Yêu cầu trả hàng chưa được duyệt hoặc đã hoàn tiền!");
        }

        request.setStatus(ReturnStatus.REFUND_COMPLETED);
        request.setRefundMethod(method.toUpperCase());
        request.setRefundNote(note);

        // Gửi email thông báo hoàn tiền thành công với phương thức đã chọn
        try {
            emailService.sendRefundNotification(request.getOrder(), request.getRefundAmount(), method.toUpperCase());
        } catch (Exception e) {
            System.err.println(">>> [EMAIL] Lỗi gửi mail hoàn tiền thành công: " + e.getMessage());
        }

        return repository.save(request);
    }
}
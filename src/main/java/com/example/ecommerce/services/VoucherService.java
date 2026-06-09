package com.example.ecommerce.services;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ecommerce.entities.User;
import com.example.ecommerce.entities.Voucher;
import com.example.ecommerce.repositories.UserRepository;
import com.example.ecommerce.repositories.VoucherRepository;

@Service
public class VoucherService {

    @Autowired
    private VoucherRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<Voucher> findAll() {
        return repository.findAll();
    }

    public Voucher findById(Long id) {
        Optional<Voucher> obj = repository.findById(id);
        return obj.orElseThrow(() -> new RuntimeException("Voucher không tồn tại!"));
    }

    public List<Voucher> findAllAvailable() {
        return repository.findAllAvailable();
    }

    public List<Voucher> findAllAvailableForUser(Long userId) {
        return repository.findAllAvailableForUser(userId);
    }

    @Transactional
    public Voucher insert(Voucher obj) {
        Voucher saved = repository.save(obj);

        // Gửi WebSocket thông báo
        try {
            if (Boolean.TRUE.equals(saved.getAssignedToAll())) {
                // Voucher public → gửi cho tất cả user qua topic public
                messagingTemplate.convertAndSend("/topic/public-notifications", saved);
                System.out.println(">>> [WS] Gửi voucher public: " + saved.getCode());
            } else {
                // Voucher riêng tư → chỉ gửi cho các user được gán
                if (saved.getAssignedUsers() != null) {
                    for (var user : saved.getAssignedUsers()) {
                        Map<String, Object> notification = new HashMap<>();
                        notification.put("type", "VOUCHER_PERSONAL");
                        notification.put("id", "voucher-" + saved.getId() + "-" + System.currentTimeMillis());
                        notification.put("code", saved.getCode());
                        notification.put("discountPercent", saved.getDiscountPercent());
                        notification.put("description", saved.getDescription() != null ? saved.getDescription() : "");
                        notification.put("title", "🎁 Voucher riêng cho bạn!");
                        notification.put("message", "Bạn vừa nhận được voucher \"" + saved.getCode() + "\" giảm " + saved.getDiscountPercent().intValue() + "% dành riêng!");
                        notification.put("timestamp", Instant.now().toString());
                        messagingTemplate.convertAndSend("/topic/user-" + user.getId(), notification);
                        System.out.println(">>> [WS] Gửi voucher riêng cho user-" + user.getId());
                    }
                }
            }
        } catch (Exception e) {
            System.err.println(">>> [WS] Lỗi gửi WebSocket: " + e.getMessage());
        }

        // Gửi Email trong thread riêng — lỗi email không ảnh hưởng WebSocket
        new Thread(() -> {
            try {
                List<User> usersToNotify;
                if (Boolean.TRUE.equals(saved.getAssignedToAll())) {
                    usersToNotify = userRepository.findAll();
                } else {
                    usersToNotify = saved.getAssignedUsers() == null
                            ? List.of()
                            : List.copyOf(saved.getAssignedUsers());
                }
                for (User user : usersToNotify) {
                    try {
                        emailService.sendNewVoucherNotification(user.getEmail(), saved);
                    } catch (Exception e) {
                        System.err.println(">>> [EMAIL] Lỗi gửi email cho "
                                + user.getEmail() + ": " + e.getMessage());
                    }
                }
            } catch (Exception e) {
                System.err.println(">>> [EMAIL] Lỗi chung: " + e.getMessage());
            }
        }).start();

        return saved;
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public Voucher update(Long id, Voucher obj) {
        Voucher entity = repository.getReferenceById(id);
        updateData(entity, obj);
        Voucher saved = repository.save(entity);

        // Gửi WebSocket NGAY trên main thread
        try {
            messagingTemplate.convertAndSend("/topic/public-notifications", saved);
            System.out.println(">>> [WS] Gửi notification update voucher thành công!");
        } catch (Exception e) {
            System.err.println(">>> [WS] Lỗi gửi WebSocket khi update: " + e.getMessage());
        }

        // Gửi Email trong thread riêng
        new Thread(() -> {
            try {
                List<User> usersToNotify;
                if (Boolean.TRUE.equals(saved.getAssignedToAll())) {
                    usersToNotify = userRepository.findAll();
                } else {
                    usersToNotify = saved.getAssignedUsers() == null
                            ? List.of()
                            : List.copyOf(saved.getAssignedUsers());
                }
                for (User user : usersToNotify) {
                    try {
                        emailService.sendNewVoucherNotification(user.getEmail(), saved);
                    } catch (Exception e) {
                        System.err.println(">>> [EMAIL] Lỗi gửi email cập nhật voucher cho "
                                + user.getEmail() + ": " + e.getMessage());
                    }
                }
            } catch (Exception e) {
                System.err.println(">>> [EMAIL] Lỗi chung khi update: " + e.getMessage());
            }
        }).start();

        return saved;
    }

    private void updateData(Voucher entity, Voucher obj) {
        entity.setCode(obj.getCode());
        entity.setDescription(obj.getDescription());
        entity.setDiscountPercent(obj.getDiscountPercent());
        entity.setMaxDiscountAmount(obj.getMaxDiscountAmount());
        entity.setMinOrderAmount(obj.getMinOrderAmount());
        entity.setStartDate(obj.getStartDate());
        entity.setExpiryDate(obj.getExpiryDate());
        entity.setUsageLimit(obj.getUsageLimit());
        entity.setActive(obj.getActive());
        entity.setAssignedToAll(obj.getAssignedToAll());
        entity.setAssignedUsers(obj.getAssignedUsers());
    }
}
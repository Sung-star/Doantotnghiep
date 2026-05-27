package com.example.ecommerce.services;

import java.util.List;
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
    private SimpMessagingTemplate messagingTemplate; // Dùng để gửi tin nhắn WebSocket

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

        new Thread(() -> {
            try {
                messagingTemplate.convertAndSend("/topic/public-notifications", saved);

                List<User> usersToNotify;
                if (Boolean.TRUE.equals(saved.getAssignedToAll())) {
                    usersToNotify = userRepository.findAll();
                } else {
                    usersToNotify = saved.getAssignedUsers() == null ? List.of() : List.copyOf(saved.getAssignedUsers());
                }

                for (User user : usersToNotify) {
                    emailService.sendNewVoucherNotification(user.getEmail(), saved);
                }
            } catch (Exception e) {
                System.err.println("Lỗi gửi thông báo Voucher (WebSocket/Email): " + e.getMessage());
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

        // Gửi thông báo và email cho người dùng khi voucher được cập nhật/gán
        new Thread(() -> {
            try {
                messagingTemplate.convertAndSend("/topic/public-notifications", saved);

                List<User> usersToNotify;
                if (Boolean.TRUE.equals(saved.getAssignedToAll())) {
                    usersToNotify = userRepository.findAll();
                } else {
                    usersToNotify = saved.getAssignedUsers() == null ? List.of() : List.copyOf(saved.getAssignedUsers());
                }

                for (User user : usersToNotify) {
                    try {
                        emailService.sendNewVoucherNotification(user.getEmail(), saved);
                    } catch (Exception e) {
                        System.err.println("Lỗi gửi email thông báo cập nhật voucher cho " + user.getEmail() + ": " + e.getMessage());
                    }
                }
            } catch (Exception e) {
                System.err.println("Lỗi gửi thông báo Voucher (WebSocket/Email) khi update: " + e.getMessage());
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

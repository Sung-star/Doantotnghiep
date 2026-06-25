package com.example.ecommerce.resources;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecommerce.entities.User;
import com.example.ecommerce.entities.Voucher;
import com.example.ecommerce.repositories.UserRepository;
import com.example.ecommerce.services.VoucherService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/api/vouchers")
public class VoucherResource {

    @Autowired
    private VoucherService service;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Voucher>> findAll() {
        List<Voucher> list = service.findAll();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping(value = "/available")
    public ResponseEntity<List<Voucher>> findAvailable() {
        List<Voucher> list = service.findAllAvailable();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping(value = "/available/user/{userId}")
    public ResponseEntity<List<Voucher>> findAvailableForUser(@PathVariable Long userId) {
        List<Voucher> list = service.findAllAvailableForUser(userId);
        return ResponseEntity.ok().body(list);
    }

    @GetMapping(value = "/user/{userId}/available")
    public ResponseEntity<List<Voucher>> findAvailableForUserAlias(@PathVariable Long userId) {
        return findAvailableForUser(userId);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Voucher> findById(@PathVariable Long id) {
        Voucher obj = service.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    @PostMapping
    public ResponseEntity<Voucher> insert(@RequestBody VoucherRequestDTO dto) {
        Voucher obj = toVoucher(dto);
        obj = service.insert(obj);
        return ResponseEntity.ok().body(obj);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Voucher> update(@PathVariable Long id, @RequestBody VoucherRequestDTO dto) {
        Voucher obj = toVoucher(dto);
        obj = service.update(id, obj);
        return ResponseEntity.ok().body(obj);
    }

    private Voucher toVoucher(VoucherRequestDTO dto) {
        Voucher voucher = new Voucher();
        voucher.setCode(dto.getCode());
        voucher.setDescription(dto.getDescription());
        voucher.setDiscountPercent(dto.getDiscountPercent());
        voucher.setMaxDiscountAmount(dto.getMaxDiscountAmount());
        voucher.setMinOrderAmount(dto.getMinOrderAmount());
        voucher.setStartDate(dto.getStartDate());
        voucher.setExpiryDate(dto.getExpiryDate());
        voucher.setUsageLimit(dto.getUsageLimit());
        voucher.setActive(dto.getActive());
        voucher.setAssignedToAll(Boolean.TRUE.equals(dto.getAssignedToAll()));
        voucher.setAssignedUsers(new java.util.HashSet<>());

        if (!Boolean.TRUE.equals(voucher.getAssignedToAll()) && dto.getAssignedUserIds() != null && !dto.getAssignedUserIds().isEmpty()) {
            java.util.Set<User> users = new java.util.HashSet<>();
            for (Long userId : dto.getAssignedUserIds()) {
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User không tồn tại: " + userId));
                users.add(user);
            }
            voucher.setAssignedUsers(users);
        }

        return voucher;
    }

    public static class VoucherRequestDTO {
        private String code;
        private String description;
        private Double discountPercent;
        private Double maxDiscountAmount;
        private Double minOrderAmount;
        private java.time.Instant startDate;
        private java.time.Instant expiryDate;
        private Integer usageLimit;
        private Boolean active;
        private Boolean assignedToAll;
        private java.util.List<Long> assignedUserIds;

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Double getDiscountPercent() { return discountPercent; }
        public void setDiscountPercent(Double discountPercent) { this.discountPercent = discountPercent; }
        public Double getMaxDiscountAmount() { return maxDiscountAmount; }
        public void setMaxDiscountAmount(Double maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; }
        public Double getMinOrderAmount() { return minOrderAmount; }
        public void setMinOrderAmount(Double minOrderAmount) { this.minOrderAmount = minOrderAmount; }
        public java.time.Instant getStartDate() { return startDate; }
        public void setStartDate(java.time.Instant startDate) { this.startDate = startDate; }
        public java.time.Instant getExpiryDate() { return expiryDate; }
        public void setExpiryDate(java.time.Instant expiryDate) { this.expiryDate = expiryDate; }
        public Integer getUsageLimit() { return usageLimit; }
        public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }
        public Boolean getActive() { return active; }
        public void setActive(Boolean active) { this.active = active; }
        public Boolean getAssignedToAll() { return assignedToAll; }
        public void setAssignedToAll(Boolean assignedToAll) { this.assignedToAll = assignedToAll; }
        public java.util.List<Long> getAssignedUserIds() { return assignedUserIds; }
        public void setAssignedUserIds(java.util.List<Long> assignedUserIds) { this.assignedUserIds = assignedUserIds; }
    }
}

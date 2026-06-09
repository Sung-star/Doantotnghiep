package com.example.ecommerce.controllers;

import com.example.ecommerce.entities.LoyaltyPoint;
import com.example.ecommerce.entities.LoyaltyTransaction;
import com.example.ecommerce.entities.User;
import com.example.ecommerce.services.LoyaltyService;
import com.example.ecommerce.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/loyalty")
public class AdminLoyaltyController {

    @Autowired
    private LoyaltyService loyaltyService;

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> listUsersLoyalty() {
        List<User> users = userService.findAll();
        List<Map<String, Object>> response = users.stream().map(u -> {
            LoyaltyPoint lp = loyaltyService.getUserLoyalty(u.getId());
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("userId", u.getId());
            map.put("name", u.getName());
            map.put("email", u.getEmail());
            map.put("tier", lp.getLoyaltyTier());
            map.put("availablePoints", lp.getAvailablePoints());
            map.put("totalPoints", lp.getTotalPoints());
            map.put("joinDate", lp.getJoinDate());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/adjust")
    public ResponseEntity<?> adjustPoints(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            Long delta = Long.valueOf(payload.get("delta").toString());
            String reason = payload.get("reason") != null ? payload.get("reason").toString() : "Admin adjustment";

            loyaltyService.adminAdjustPoints(userId, delta, reason);
            return ResponseEntity.ok(Map.of("message", "Points adjusted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<LoyaltyTransaction>> getUserHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(loyaltyService.getTransactionHistory(userId));
    }
}

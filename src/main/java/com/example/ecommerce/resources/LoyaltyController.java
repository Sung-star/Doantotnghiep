package com.example.ecommerce.resources;

import com.example.ecommerce.entities.LoyaltyPoint;
import com.example.ecommerce.entities.LoyaltyTransaction;
import com.example.ecommerce.entities.Voucher;
import com.example.ecommerce.services.LoyaltyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Loyalty Controller - API cho hệ thống điểm thưởng
 */
@RestController
@RequestMapping("/api/loyalty")
@CrossOrigin(origins = "http://localhost:5173")
public class LoyaltyController {

    @Autowired
    private LoyaltyService loyaltyService;

    /**
     * GET /api/loyalty/user/{userId}
     * Lấy thông tin loyalty đầy đủ của user (kèm progress)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserLoyalty(@PathVariable Long userId) {
        LoyaltyPoint lp = loyaltyService.getUserLoyalty(userId);
        Map<String, Object> result = buildLoyaltyResponse(lp);
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/loyalty/user/{userId}/transactions
     * Lấy lịch sử giao dịch điểm
     */
    @GetMapping("/user/{userId}/transactions")
    public ResponseEntity<List<LoyaltyTransaction>> getTransactions(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "50") int limit) {
        List<LoyaltyTransaction> txs = loyaltyService.getTransactionHistory(userId, limit);
        return ResponseEntity.ok(txs);
    }

    /**
     * GET /api/loyalty/redeem-packages
     * Lấy danh sách gói đổi điểm
     */
    @GetMapping("/redeem-packages")
    public ResponseEntity<List<Map<String, Object>>> getRedeemPackages() {
        long[][] packages = LoyaltyService.REDEEM_PACKAGES;
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (int i = 0; i < packages.length; i++) {
            Map<String, Object> pkg = new HashMap<>();
            pkg.put("index", i);
            pkg.put("pointsRequired", packages[i][0]);
            pkg.put("discountPercent", packages[i][1]);
            pkg.put("maxDiscountAmount", packages[i][2]);
            result.add(pkg);
        }
        return ResponseEntity.ok(result);
    }

    /**
     * POST /api/loyalty/user/{userId}/redeem
     * Đổi điểm lấy voucher
     */
    @PostMapping("/user/{userId}/redeem")
    public ResponseEntity<Map<String, Object>> redeemPoints(
            @PathVariable Long userId,
            @RequestParam Long packageIndex) {
        try {
            Voucher voucher = loyaltyService.redeemPointsForVoucher(userId, packageIndex);
            LoyaltyPoint lp = loyaltyService.getUserLoyalty(userId);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Đổi điểm thành công! Voucher đã được thêm vào tài khoản.");
            result.put("voucherCode", voucher.getCode());
            result.put("discountPercent", voucher.getDiscountPercent());
            result.put("expiryDate", voucher.getExpiryDate());
            result.put("remainingPoints", lp.getAvailablePoints());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * POST /api/loyalty/add-points
     * Thêm điểm vào tài khoản user (từ đơn hàng)
     */
    @PostMapping("/add-points")
    public ResponseEntity<String> addPoints(
            @RequestParam Long userId,
            @RequestParam Double amount) {
        try {
            loyaltyService.addPoints(userId, amount);
            return ResponseEntity.ok("Đã thêm điểm thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * POST /api/loyalty/deduct-points
     * Trừ điểm khi redemm
     */
    @PostMapping("/deduct-points")
    public ResponseEntity<String> deductPoints(
            @RequestParam Long userId,
            @RequestParam Long points) {
        try {
            loyaltyService.deductPoints(userId, points);
            return ResponseEntity.ok("Đã trừ điểm thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * POST /api/loyalty/refund-points
     * Hoàn điểm khi hủy đơn
     */
    @PostMapping("/refund-points")
    public ResponseEntity<String> refundPoints(
            @RequestParam Long userId,
            @RequestParam Double orderTotal) {
        try {
            loyaltyService.refundPoints(userId, orderTotal);
            return ResponseEntity.ok("Đã hoàn điểm thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ===========================================================
    // Helper
    // ===========================================================
    private Map<String, Object> buildLoyaltyResponse(LoyaltyPoint lp) {
        Map<String, Object> result = new HashMap<>();
        result.put("id", lp.getId());
        result.put("userId", lp.getUser().getId());
        result.put("totalPoints", lp.getTotalPoints());
        result.put("availablePoints", lp.getAvailablePoints());
        result.put("usedPoints", lp.getTotalPoints() - lp.getAvailablePoints());
        result.put("loyaltyTier", lp.getLoyaltyTier());
        result.put("joinDate", lp.getJoinDate());
        result.put("lastUpdated", lp.getLastUpdated());
        result.put("pointsUntilNextTier", loyaltyService.getPointsUntilNextTier(lp.getTotalPoints()));
        result.put("tierProgress", loyaltyService.getTierProgress(lp.getTotalPoints()));
        return result;
    }
}

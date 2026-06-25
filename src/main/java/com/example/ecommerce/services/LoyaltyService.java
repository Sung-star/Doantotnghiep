package com.example.ecommerce.services;

import com.example.ecommerce.entities.LoyaltyPoint;
import com.example.ecommerce.entities.LoyaltyTransaction;
import com.example.ecommerce.entities.User;
import com.example.ecommerce.entities.Voucher;
import com.example.ecommerce.repositories.LoyaltyPointRepository;
import com.example.ecommerce.repositories.LoyaltyTransactionRepository;
import com.example.ecommerce.repositories.UserRepository;
import com.example.ecommerce.repositories.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

/**
 * Loyalty Service - Quản lý hệ thống điểm thưởng khách hàng
 * - Kiếm điểm từ mua hàng (1,000đ = 1 điểm)
 * - Nâng cấp tier tự động (BRONZE → SILVER → GOLD → PLATINUM)
 * - Đổi điểm lấy voucher giảm giá
 * - Lịch sử giao dịch điểm
 */
@Service
public class LoyaltyService {

    @Autowired
    private LoyaltyPointRepository loyaltyPointRepository;

    @Autowired
    private LoyaltyTransactionRepository loyaltyTransactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    // ===========================================================
    // TIER CONFIGURATION
    // ===========================================================
    private static final long SILVER_THRESHOLD  = 1000L;
    private static final long GOLD_THRESHOLD    = 5000L;
    private static final long PLATINUM_THRESHOLD = 10000L;

    // Các gói đổi điểm: points cần bỏ → discountPercent được tặng
    public static final long[][] REDEEM_PACKAGES = {
        {500L,  5L,  50000L},  // 500 điểm → 5% (tối đa 50k)
        {1000L, 10L, 100000L}, // 1000 điểm → 10% (tối đa 100k)
        {2000L, 15L, 200000L}, // 2000 điểm → 15% (tối đa 200k)
        {5000L, 25L, 500000L}, // 5000 điểm → 25% (tối đa 500k)
    };

    // ===========================================================
    // CORE: GET OR CREATE
    // ===========================================================
    public LoyaltyPoint getOrCreateLoyaltyPoint(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại!"));

        return loyaltyPointRepository.findByUserId(userId)
                .orElseGet(() -> {
                    LoyaltyPoint lp = new LoyaltyPoint();
                    lp.setUser(user);
                    lp.setTotalPoints(0L);
                    lp.setAvailablePoints(0L);
                    lp.setLoyaltyTier("BRONZE");
                    lp.setJoinDate(Instant.now());
                    return loyaltyPointRepository.save(lp);
                });
    }

    // ===========================================================
    // EARN POINTS (từ mua hàng)
    // ===========================================================
    @Transactional
    public void addPoints(Long userId, Double orderTotal) {
        LoyaltyPoint lp = getOrCreateLoyaltyPoint(userId);

        long basePoints = Math.round(orderTotal / 1000);
        double multiplier = getTierMultiplier(lp.getLoyaltyTier());
        long pointsToAdd = Math.round(basePoints * multiplier);

        if (pointsToAdd <= 0) return;

        lp.setTotalPoints(lp.getTotalPoints() + pointsToAdd);
        lp.setAvailablePoints(lp.getAvailablePoints() + pointsToAdd);

        String oldTier = lp.getLoyaltyTier();
        updateTier(lp);
        lp.setLastUpdated(Instant.now());
        loyaltyPointRepository.save(lp);

        // Ghi lịch sử
        String desc = "Kiếm điểm từ đơn hàng (" + String.format("%,.0f", orderTotal) + "đ)";
        if (!lp.getLoyaltyTier().equals(oldTier)) {
            desc += " | Nâng cấp lên " + lp.getLoyaltyTier();
        }
        saveTransaction(lp.getUser(), "EARN", pointsToAdd, lp.getAvailablePoints(), desc, null);

        System.out.println(">>> [LOYALTY] Thêm " + pointsToAdd + " điểm cho user-" + userId
                + " (order: " + String.format("%.0f", orderTotal) + "đ)");
    }

    // ===========================================================
    // DEDUCT POINTS (khi redeem voucher)
    // ===========================================================
    @Transactional
    public void deductPoints(Long userId, Long points) {
        LoyaltyPoint lp = getOrCreateLoyaltyPoint(userId);
        if (lp.getAvailablePoints() < points) {
            throw new RuntimeException("Điểm không đủ! Hiện có: " + lp.getAvailablePoints());
        }
        lp.setAvailablePoints(lp.getAvailablePoints() - points);
        lp.setLastUpdated(Instant.now());
        loyaltyPointRepository.save(lp);

        saveTransaction(lp.getUser(), "DEDUCT", -points, lp.getAvailablePoints(), "Trừ điểm", null);
    }

    // ===========================================================
    // REFUND POINTS (khi hủy đơn)
    // ===========================================================
    @Transactional
    public void refundPoints(Long userId, Double orderTotal) {
        LoyaltyPoint lp = getOrCreateLoyaltyPoint(userId);
        long basePoints = Math.round(orderTotal / 1000);
        double multiplier = getTierMultiplier(lp.getLoyaltyTier());
        long pointsToRefund = Math.round(basePoints * multiplier);

        lp.setTotalPoints(Math.max(0, lp.getTotalPoints() - pointsToRefund));
        lp.setAvailablePoints(Math.max(0, lp.getAvailablePoints() - pointsToRefund));
        lp.setLastUpdated(Instant.now());
        loyaltyPointRepository.save(lp);

        saveTransaction(lp.getUser(), "REFUND", -pointsToRefund, lp.getAvailablePoints(),
                "Hoàn điểm khi hủy đơn hàng", null);
    }

    // ===========================================================
    // ADMIN ADJUST POINTS
    // ===========================================================
    @Transactional
    public void adminAdjustPoints(Long userId, Long delta, String reason) {
        LoyaltyPoint lp = getOrCreateLoyaltyPoint(userId);
        
        if (delta > 0) {
            lp.setTotalPoints(lp.getTotalPoints() + delta);
            lp.setAvailablePoints(lp.getAvailablePoints() + delta);
            updateTier(lp);
            lp.setLastUpdated(Instant.now());
            loyaltyPointRepository.save(lp);
            saveTransaction(lp.getUser(), "ADMIN_ADD", delta, lp.getAvailablePoints(), reason != null ? reason : "Admin cộng điểm", null);
        } else if (delta < 0) {
            long absDelta = Math.abs(delta);
            if (lp.getAvailablePoints() < absDelta) {
                throw new RuntimeException("Không đủ điểm để trừ! Hiện có: " + lp.getAvailablePoints());
            }
            lp.setAvailablePoints(lp.getAvailablePoints() - absDelta);
            // Total points shouldn't be decreased on manual deduction unless specified, but let's just decrease available points for penalties.
            lp.setLastUpdated(Instant.now());
            loyaltyPointRepository.save(lp);
            saveTransaction(lp.getUser(), "ADMIN_DEDUCT", delta, lp.getAvailablePoints(), reason != null ? reason : "Admin trừ điểm", null);
        }
    }

    // ===========================================================
    // REDEEM POINTS → VOUCHER
    // ===========================================================
    @Transactional
    public Voucher redeemPointsForVoucher(Long userId, Long packageIndex) {
        LoyaltyPoint lp = getOrCreateLoyaltyPoint(userId);

        if (packageIndex < 0 || packageIndex >= REDEEM_PACKAGES.length) {
            throw new RuntimeException("Gói đổi điểm không hợp lệ!");
        }

        long[] pkg = REDEEM_PACKAGES[(int) (long) packageIndex];
        long pointsRequired = pkg[0];
        long discountPercent = pkg[1];
        long maxDiscount = pkg[2];

        if (lp.getAvailablePoints() < pointsRequired) {
            throw new RuntimeException("Không đủ điểm! Cần " + pointsRequired
                    + " điểm, hiện có " + lp.getAvailablePoints() + " điểm.");
        }

        // Tạo voucher mới
        Voucher voucher = new Voucher();
        String code = "LOYALTY" + pointsRequired + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        voucher.setCode(code);
        voucher.setDescription("🎁 Voucher đổi từ " + pointsRequired + " điểm thưởng");
        voucher.setDiscountPercent((double) discountPercent);
        voucher.setMaxDiscountAmount((double) maxDiscount);
        voucher.setMinOrderAmount(100000.0);
        voucher.setStartDate(Instant.now());
        voucher.setExpiryDate(Instant.now().plus(30, ChronoUnit.DAYS));
        voucher.setUsageLimit(1);
        voucher.setActive(true);
        voucher.setAssignedToAll(false);

        // Gán riêng cho user này
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại!"));
        voucher.getAssignedUsers().add(user);

        Voucher savedVoucher = voucherRepository.save(voucher);

        // Trừ điểm
        lp.setAvailablePoints(lp.getAvailablePoints() - pointsRequired);
        lp.setLastUpdated(Instant.now());
        loyaltyPointRepository.save(lp);

        // Ghi lịch sử
        saveTransaction(user, "REDEEM", -pointsRequired, lp.getAvailablePoints(),
                "Đổi " + pointsRequired + " điểm lấy voucher " + discountPercent + "%",
                savedVoucher.getCode());

        System.out.println(">>> [LOYALTY] User-" + userId + " đổi " + pointsRequired
                + " điểm → Voucher " + savedVoucher.getCode());

        return savedVoucher;
    }

    // ===========================================================
    // GET LOYALTY INFO
    // ===========================================================
    public LoyaltyPoint getUserLoyalty(Long userId) {
        return getOrCreateLoyaltyPoint(userId);
    }

    // ===========================================================
    // TRANSACTION HISTORY
    // ===========================================================
    public List<LoyaltyTransaction> getTransactionHistory(Long userId) {
        return loyaltyTransactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<LoyaltyTransaction> getTransactionHistory(Long userId, int limit) {
        return loyaltyTransactionRepository.findByUserIdOrderByCreatedAtDesc(
                userId, PageRequest.of(0, limit));
    }

    // ===========================================================
    // UTILITIES
    // ===========================================================
    private double getTierMultiplier(String tier) {
        switch (tier) {
            case "SILVER":   return 1.2;
            case "GOLD":     return 1.5;
            case "PLATINUM": return 2.0;
            default:         return 1.0; // BRONZE
        }
    }

    private void updateTier(LoyaltyPoint lp) {
        String newTier = "BRONZE";
        long pts = lp.getTotalPoints();
        if (pts >= PLATINUM_THRESHOLD)     newTier = "PLATINUM";
        else if (pts >= GOLD_THRESHOLD)    newTier = "GOLD";
        else if (pts >= SILVER_THRESHOLD)  newTier = "SILVER";

        if (!newTier.equals(lp.getLoyaltyTier())) {
            System.out.println(">>> [LOYALTY] User-" + lp.getUser().getId()
                    + " nâng cấp từ " + lp.getLoyaltyTier() + " lên " + newTier);
            lp.setLoyaltyTier(newTier);
        }
    }

    /**
     * Tính số điểm cần để lên tier tiếp theo
     */
    public long getPointsUntilNextTier(long totalPoints) {
        if (totalPoints >= PLATINUM_THRESHOLD) return 0;
        if (totalPoints >= GOLD_THRESHOLD)     return PLATINUM_THRESHOLD - totalPoints;
        if (totalPoints >= SILVER_THRESHOLD)   return GOLD_THRESHOLD - totalPoints;
        return SILVER_THRESHOLD - totalPoints;
    }

    /**
     * Tính % tiến trình đến tier tiếp theo
     */
    public double getTierProgress(long totalPoints) {
        if (totalPoints >= PLATINUM_THRESHOLD) return 100.0;
        if (totalPoints >= GOLD_THRESHOLD)
            return (double)(totalPoints - GOLD_THRESHOLD) / (PLATINUM_THRESHOLD - GOLD_THRESHOLD) * 100;
        if (totalPoints >= SILVER_THRESHOLD)
            return (double)(totalPoints - SILVER_THRESHOLD) / (GOLD_THRESHOLD - SILVER_THRESHOLD) * 100;
        return (double) totalPoints / SILVER_THRESHOLD * 100;
    }

    private void saveTransaction(User user, String type, long points, long balanceAfter,
                                  String description, String referenceId) {
        LoyaltyTransaction tx = new LoyaltyTransaction(user, type, points, balanceAfter, description, referenceId);
        loyaltyTransactionRepository.save(tx);
    }
}

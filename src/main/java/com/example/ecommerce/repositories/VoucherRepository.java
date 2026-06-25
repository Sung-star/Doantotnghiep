package com.example.ecommerce.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.ecommerce.entities.Voucher;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {

    @Query("SELECT v FROM Voucher v WHERE v.code = :code " +
           "AND v.active = true " +
           "AND (v.startDate IS NULL OR v.startDate <= CURRENT_TIMESTAMP) " +
           "AND v.expiryDate > CURRENT_TIMESTAMP " +
           "AND (v.usageLimit IS NULL OR v.usedCount < v.usageLimit)")
    Optional<Voucher> findActiveByCode(@Param("code") String code);

    @Query("SELECT v FROM Voucher v WHERE v.active = true AND v.expiryDate > CURRENT_TIMESTAMP AND (v.usageLimit IS NULL OR v.usedCount < v.usageLimit)")
    List<Voucher> findAllAvailable();

    @Query("SELECT DISTINCT v FROM Voucher v LEFT JOIN v.assignedUsers u WHERE v.active = true " +
           "AND v.expiryDate > CURRENT_TIMESTAMP " +
           "AND (v.usageLimit IS NULL OR v.usedCount < v.usageLimit) " +
           "AND (v.assignedToAll = true OR u.id = :userId)")
    List<Voucher> findAllAvailableForUser(@Param("userId") Long userId);
}
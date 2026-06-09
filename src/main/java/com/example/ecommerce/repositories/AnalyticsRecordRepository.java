package com.example.ecommerce.repositories;

import com.example.ecommerce.entities.AnalyticsRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnalyticsRecordRepository extends JpaRepository<AnalyticsRecord, Long> {

    // Lấy doanh thu theo khoảng ngày
    @Query("SELECT a FROM AnalyticsRecord a WHERE a.metricType = 'DAILY_REVENUE' " +
           "AND a.recordDate BETWEEN :fromDate AND :toDate ORDER BY a.recordDate ASC")
    List<AnalyticsRecord> findDailyRevenue(@Param("fromDate") String fromDate, @Param("toDate") String toDate);

    // Top sản phẩm bán chạy
    @Query("SELECT a FROM AnalyticsRecord a WHERE a.metricType = 'PRODUCT_SALES' " +
           "AND a.recordDate = :date ORDER BY a.quantity DESC")
    List<AnalyticsRecord> findTopProductsByDate(@Param("date") String date);

    // Lấy records của product cụ thể
    List<AnalyticsRecord> findByProductIdAndMetricTypeOrderByRecordDateDesc(Long productId, String metricType);
}

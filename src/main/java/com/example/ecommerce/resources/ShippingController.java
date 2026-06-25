package com.example.ecommerce.resources;

import com.example.ecommerce.dto.ShippingFeeDTO;
import com.example.ecommerce.entities.District;
import com.example.ecommerce.entities.Ward;
import com.example.ecommerce.services.ShippingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Shipping Controller - API cho hệ thống vận chuyển
 */
@RestController
@RequestMapping("/api/shipping")
@CrossOrigin(origins = "http://localhost:5173")
public class ShippingController {

    @Autowired
    private ShippingService shippingService;

    /**
     * GET /api/shipping/fee
     * Tính phí vận chuyển
     * ?district=Quận 1&ward=Phường Bến Nghé
     */
    @GetMapping("/fee")
    public ResponseEntity<Map<String, Object>> calculateFee(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String ward) {
        
        ShippingFeeDTO feeDTO;
        if (district != null && ward != null) {
            feeDTO = shippingService.calculateShippingFeeWithWard(district, ward);
        } else if (district != null) {
            feeDTO = shippingService.calculateShippingFee(district);
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Vui lòng cung cấp district"));
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("district", feeDTO.getDistrictName());
        response.put("ward", feeDTO.getWardName());
        response.put("fee", feeDTO.getTotalShippingFee());
        response.put("baseFee", feeDTO.getBaseFee());
        response.put("isFreeShipping", feeDTO.getIsFreeShipping());
        response.put("currency", "VND");
        
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/shipping/districts
     * Lấy danh sách tất cả quận
     */
    @GetMapping("/districts")
    public ResponseEntity<List<District>> getAllDistricts() {
        List<District> districts = shippingService.getAllDistricts();
        return ResponseEntity.ok(districts);
    }

    /**
     * GET /api/shipping/districts/{districtId}/wards
     * Lấy danh sách phường của quận
     */
    @GetMapping("/districts/{districtId}/wards")
    public ResponseEntity<List<Ward>> getWards(@PathVariable Long districtId) {
        List<Ward> wards = shippingService.getWardsByDistrict(districtId);
        return ResponseEntity.ok(wards);
    }

    /**
     * GET /api/shipping/districts/{districtId}
     * Lấy thông tin chi tiết quận
     */
    @GetMapping("/districts/{districtId}")
    public ResponseEntity<District> getDistrictDetails(@PathVariable Long districtId) {
        try {
            District district = shippingService.getDistrictDetails(districtId);
            return ResponseEntity.ok(district);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

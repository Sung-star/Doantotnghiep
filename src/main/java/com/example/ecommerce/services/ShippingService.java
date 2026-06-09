package com.example.ecommerce.services;

import com.example.ecommerce.dto.ShippingFeeDTO;
import com.example.ecommerce.entities.District;
import com.example.ecommerce.entities.ShippingFeeConfig;
import com.example.ecommerce.entities.Ward;
import com.example.ecommerce.repositories.DistrictRepository;
import com.example.ecommerce.repositories.ShippingFeeConfigRepository;
import com.example.ecommerce.repositories.WardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ShippingService {

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private WardRepository wardRepository;

    @Autowired
    private ShippingFeeConfigRepository shippingFeeConfigRepository;

    // ===== GET ALL DISTRICTS =====
    public List<District> getAllDistricts() {
        return districtRepository.findByActiveTrue();
    }

    // ===== GET WARDS BY DISTRICT =====
    public List<Ward> getWardsByDistrict(Long districtId) {
        Optional<District> district = districtRepository.findById(districtId);
        if (district.isEmpty()) {
            return new ArrayList<>();
        }
        return wardRepository.findByDistrictId(districtId);
    }

    // ===== CALCULATE SHIPPING FEE by DISTRICT NAME =====
    @Transactional(readOnly = true)
    public ShippingFeeDTO calculateShippingFee(String districtName) {
        Optional<District> districtOpt = districtRepository.findByName(districtName);
        
        if (districtOpt.isEmpty()) {
            // Default fallback fee for unknown district
            ShippingFeeDTO result = new ShippingFeeDTO();
            result.setBaseFee(50000.0);
            result.setTotalShippingFee(50000.0);
            result.setIsFreeShipping(false);
            return result;
        }
        
        District district = districtOpt.get();
        ShippingFeeDTO result = new ShippingFeeDTO();
        result.setDistrictId(district.getId());
        result.setDistrictName(district.getName());
        result.setBaseFee(district.getBaseShippingFee());
        result.setTotalShippingFee(district.getBaseShippingFee());
        result.setIsFreeShipping(false);
        
        return result;
    }

    // ===== CALCULATE SHIPPING FEE by DISTRICT + WARD =====
    @Transactional(readOnly = true)
    public ShippingFeeDTO calculateShippingFeeWithWard(String districtName, String wardName) {
        ShippingFeeDTO result = calculateShippingFee(districtName);
        
        if (wardName != null && !wardName.isEmpty()) {
            Optional<Ward> wardOpt = wardRepository.findByName(wardName);
            if (wardOpt.isPresent()) {
                Ward ward = wardOpt.get();
                Double additionalFee = ward.getAdditionalShippingFee() != null ? ward.getAdditionalShippingFee() : 0.0;
                result.setTotalShippingFee(result.getTotalShippingFee() + additionalFee);
                result.setWardName(wardName);
            }
        }
        
        return result;
    }

    // ===== GET DISTRICT DETAILS =====
    public District getDistrictDetails(Long districtId) {
        return districtRepository.findById(districtId)
            .orElseThrow(() -> new RuntimeException("District not found"));
    }

    // ===== GET ALL DISTRICTS (For Admin) =====
    public List<District> getDistrictsForAdmin() {
        return districtRepository.findAll();
    }

    // ===== ADMIN: CREATE/UPDATE DISTRICT =====
    @Transactional
    public District saveDistrict(District district) {
        return districtRepository.save(district);
    }

    @Transactional
    public void deleteDistrict(Long districtId) {
        districtRepository.deleteById(districtId);
    }

    // ===== GET ALL SHIPPING CONFIGS =====
    public List<ShippingFeeConfig> getAllConfigs() {
        return shippingFeeConfigRepository.findAll();
    }

    // ===== ADMIN: CREATE/UPDATE CONFIG =====
    @Transactional
    public ShippingFeeConfig createConfig(ShippingFeeConfig config) {
        return shippingFeeConfigRepository.save(config);
    }

    @Transactional
    public ShippingFeeConfig updateConfig(Long configId, ShippingFeeConfig config) {
        ShippingFeeConfig existing = shippingFeeConfigRepository.findById(configId)
            .orElseThrow(() -> new RuntimeException("Config not found"));
        
        existing.setBaseFee(config.getBaseFee());
        existing.setIsActive(config.getIsActive());
        
        return shippingFeeConfigRepository.save(existing);
    }

    @Transactional
    public void deleteConfig(Long configId) {
        shippingFeeConfigRepository.deleteById(configId);
    }
}

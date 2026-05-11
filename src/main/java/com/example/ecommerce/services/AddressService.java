package com.example.ecommerce.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.ecommerce.entities.UserAddress;
import com.example.ecommerce.entities.User;
import com.example.ecommerce.repositories.UserAddressRepository;
import com.example.ecommerce.repositories.UserRepository;

@Service
public class AddressService {

    @Autowired
    private UserAddressRepository repository;

    @Autowired
    private UserRepository userRepository;

    public List<UserAddress> findByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    @Transactional
    public UserAddress insert(Long userId, UserAddress obj) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        obj.setUser(user);
        
        // If this is the first address, or isDefault is true, manage default status
        if (obj.getIsDefault() || repository.findByUserId(userId).isEmpty()) {
            obj.setIsDefault(true);
            resetDefaultAddress(userId);
        }
        
        return repository.save(obj);
    }

    @Transactional
    public void setDefault(Long userId, Long addressId) {
        resetDefaultAddress(userId);
        UserAddress addr = repository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        addr.setIsDefault(true);
        repository.save(addr);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private void resetDefaultAddress(Long userId) {
        List<UserAddress> addresses = repository.findByUserId(userId);
        for (UserAddress addr : addresses) {
            addr.setIsDefault(false);
        }
        repository.saveAll(addresses);
    }
}

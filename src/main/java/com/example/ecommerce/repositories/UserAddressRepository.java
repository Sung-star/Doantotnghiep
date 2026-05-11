package com.example.ecommerce.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ecommerce.entities.UserAddress;
import com.example.ecommerce.entities.User;

public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
    List<UserAddress> findByUser(User user);
    List<UserAddress> findByUserId(Long userId);
}

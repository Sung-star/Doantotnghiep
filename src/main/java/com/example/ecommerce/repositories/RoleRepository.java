package com.example.ecommerce.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.ecommerce.entities.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    // SỬA TỪ: findByName -> findByAuthority
    Optional<Role> findByAuthority(String authority);
}
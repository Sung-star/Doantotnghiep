package com.example.ecommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.ecommerce.entities.User;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Kiểm tra email đã tồn tại chưa (Dùng cho đăng ký)
    boolean existsByEmail(String email);
    
    // Tìm user theo email (Dùng cho đăng nhập)
    Optional<User> findByEmail(String email);

} // <--- QUAN TRỌNG: Phải có dấu ngoặc này ở cuối cùng
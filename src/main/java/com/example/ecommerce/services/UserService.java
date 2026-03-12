package com.example.ecommerce.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.ecommerce.entities.User;
import com.example.ecommerce.repositories.UserRepository;
import com.example.ecommerce.services.exceptions.DatabaseException;
import com.example.ecommerce.services.exceptions.ResourceNotFoundException;
import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    public List<User> findAll() {
        return repository.findAll();
    }

    public User findById(Long id) {
        Optional<User> user = repository.findById(id);
        return user.orElseThrow(() -> new ResourceNotFoundException(id));
    }

    public User insert(User user) {
        return repository.save(user);
    }

    // --- SỬA LỖI: Bổ sung hàm delete để fix lỗi COMPILATION ERROR ---
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(id);
        }
        try {
            repository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException(e.getMessage());
        }
    }

    // --- SỬA LỖI: Cập nhật thông tin với @Transactional để lưu xuống DB ---
    @Transactional
    public User update(Long id, User data) {
        try {
            User user = repository.getReferenceById(id);
            updateUserData(user, data);
            return repository.save(user);
        } catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException(id);
        }
    }

    private void updateUserData(User entity, User data) {
        // Chỉ cập nhật nếu có dữ liệu mới, tránh làm mất dữ liệu cũ (như mật khẩu)
        if (data.getName() != null && !data.getName().isEmpty()) {
            entity.setName(data.getName());
        }
        if (data.getPhone() != null && !data.getPhone().isEmpty()) {
            entity.setPhone(data.getPhone());
        }
        if (data.getEmail() != null && !data.getEmail().isEmpty()) {
            entity.setEmail(data.getEmail());
        }
    }
}
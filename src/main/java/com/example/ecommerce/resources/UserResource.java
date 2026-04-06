package com.example.ecommerce.resources;

import java.net.URI;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.ecommerce.entities.Role;
import com.example.ecommerce.entities.User;
import com.example.ecommerce.repositories.RoleRepository;
import com.example.ecommerce.repositories.UserRepository;
import com.example.ecommerce.services.UserService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping(value = "/users")
public class UserResource {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService service;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    // 1. LẤY DANH SÁCH
    @GetMapping
    public ResponseEntity<List<User>> findAll() {
        List<User> users = service.findAll();
        return ResponseEntity.ok().body(users);
    }

    // 2. TÌM THEO ID
    @GetMapping(value = "/{id}")
    public ResponseEntity<User> findById(@PathVariable("id") Long id) {
        User user = service.findById(id);
        return ResponseEntity.ok().body(user);
    }

    // 3. TẠO USER MỚI (Đăng ký)
    @PostMapping
    public ResponseEntity<?> insert(@RequestBody UserRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email đã tồn tại!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActive(true);

        Set<Role> roles = new HashSet<>();
        // Nếu không gửi role thì mặc định là ROLE_CLIENT
        String roleName = (request.getRole() != null && !request.getRole().isEmpty())
                ? request.getRole()
                : "ROLE_CLIENT";

        // --- ĐÃ SỬA: Dùng findByAuthority thay vì findByName ---
        Role role = roleRepository.findByAuthority(roleName)
                .orElseThrow(() -> new RuntimeException("Lỗi: Role " + roleName + " không tồn tại."));
        roles.add(role);

        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(savedUser.getId()).toUri();
        return ResponseEntity.created(uri).body(savedUser);
    }

    // 4. ĐĂNG NHẬP
    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        User user = userRepository.findByEmail(loginUser.getEmail()).orElse(null);

        if (user != null && passwordEncoder.matches(loginUser.getPassword(), user.getPassword())) {
            if (!user.isActive()) {
                return ResponseEntity.status(403).body("Tài khoản đã bị khóa!");
            }
            user.setPassword(null);
            return ResponseEntity.ok().body(user);
        } else {
            return ResponseEntity.status(401).body("Sai email hoặc mật khẩu");
        }
    }

    // 5. XÓA USER
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 6. CẬP NHẬT THÔNG TIN
    @PutMapping(value = "/{id}")
    public ResponseEntity<User> update(@PathVariable("id") Long id, @RequestBody User user) {
        user = service.update(id, user);
        return ResponseEntity.ok().body(user);
    }

    // 7. KHÓA / MỞ KHÓA TÀI KHOẢN
    @PutMapping("/{id}/status")
    public ResponseEntity<?> changeStatus(@PathVariable("id") Long id, @RequestParam("active") boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        user.setActive(active);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    // 8. ĐỔI QUYỀN (Thăng chức Admin)
    @PutMapping("/{id}/role")
    public ResponseEntity<?> changeRole(@PathVariable("id") Long id, @RequestParam("roleName") String roleName) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User không tồn tại"));

        // --- ĐÃ SỬA: Dùng findByAuthority thay vì findByName ---
        Role role = roleRepository.findByAuthority(roleName)
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));

        user.getRoles().clear();
        user.getRoles().add(role);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    // --- DTO CLASS ---
    public static class UserRequestDTO {
        private String name;
        private String email;
        private String phone;
        private String password;
        private String role;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}
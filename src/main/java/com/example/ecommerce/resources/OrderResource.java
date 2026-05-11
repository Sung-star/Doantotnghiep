package com.example.ecommerce.resources;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.entities.Order;
import com.example.ecommerce.entities.enums.OrderStatus;
import com.example.ecommerce.services.OrderService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*") // Tránh lỗi CORS từ React
@RestController
@RequestMapping(value = "/api/orders")
public class OrderResource {
	
    @Autowired
    private OrderService service;
	
    @GetMapping
    public ResponseEntity<List<Order>> findAll(){
        List<Order> orders = service.findAll();
        return ResponseEntity.ok().body(orders);
    }
	
    @GetMapping(value = "/{id}")
    public ResponseEntity<Order> findById(@PathVariable("id") Long id){
        Order order = service.findById(id);
        return ResponseEntity.ok().body(order);
    }

    // ĐẶT HÀNG MỚI (Nhận dữ liệu từ trang thanh toán)
    @PostMapping
    public ResponseEntity<Order> insert(@Valid @RequestBody OrderDTO dto) {
        Order obj = service.placeOrder(dto); 
        return ResponseEntity.ok().body(obj);
    }

    // XÓA ĐƠN HÀNG (Admin/User bấm nút Thùng rác)
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // CẬP NHẬT TRẠNG THÁI (Nút Thu tiền & Dropdown trạng thái)
    @PutMapping(value = "/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable("id") Long id, @RequestBody String status) {
        try {
            // SỬA LỖI QUAN TRỌNG: Làm sạch chuỗi gửi từ Axios/React
            // Ví dụ: ""PAID"" -> "PAID"
            String cleanStatus = status.replace("\"", "").trim().toUpperCase();
            
            Order obj = service.updateStatus(id, OrderStatus.valueOf(cleanStatus));
            return ResponseEntity.ok().body(obj);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
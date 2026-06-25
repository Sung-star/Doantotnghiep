package com.example.ecommerce.resources;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
        return ResponseEntity.status(HttpStatus.CREATED).body(obj);
    }

    // XÓA ĐƠN HÀNG (Admin/User bấm nút Thùng rác)
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // CẬP NHẬT TRẠNG THÁI (Nút Thu tiền & Dropdown trạng thái)
    @RequestMapping(value = "/{id}/status", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<Order> updateStatus(
            @PathVariable("id") Long id,
            @RequestBody(required = false) Map<String, String> payload,
            @RequestParam(value = "status", required = false) String statusQuery) {
        try {
            String status = null;
            if (payload != null && payload.containsKey("status")) {
                status = payload.get("status");
            } else if (statusQuery != null) {
                status = statusQuery;
            }
            if (status == null || status.isBlank()) {
                return ResponseEntity.badRequest().build();
            }
            String cleanStatus = status.replace("\"", "").trim().toUpperCase();
            Order obj = service.updateStatus(id, OrderStatus.valueOf(cleanStatus));
            return ResponseEntity.ok().body(obj);
        } catch (Exception e) {
            System.err.println(">>> [ERROR] updateStatus failed: " + e.getMessage());
    e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
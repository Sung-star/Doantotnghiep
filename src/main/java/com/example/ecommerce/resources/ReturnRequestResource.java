package com.example.ecommerce.resources;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.ecommerce.entities.ReturnRequest;
import com.example.ecommerce.services.ReturnRequestService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/api/returns")
public class ReturnRequestResource {

    @Autowired
    private ReturnRequestService service;

    @GetMapping
    public ResponseEntity<List<ReturnRequest>> findAll() {
        List<ReturnRequest> list = service.findAll();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ReturnRequest> findById(@PathVariable("id") Long id) {
        ReturnRequest request = service.findById(id);
        return ResponseEntity.ok().body(request);
    }

    @GetMapping(value = "/order/{orderId}")
    public ResponseEntity<ReturnRequest> findByOrderId(@PathVariable("orderId") Long orderId) {
        return service.findByOrderId(orderId)
                .map(request -> ResponseEntity.ok().body(request))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ReturnRequest> create(@RequestBody Map<String, Object> payload) {
        if (!payload.containsKey("orderId") || !payload.containsKey("reason") || !payload.containsKey("type")) {
            return ResponseEntity.badRequest().build();
        }
        Long orderId = Long.valueOf(payload.get("orderId").toString());
        String reason = payload.get("reason").toString();
        String type = payload.get("type").toString();

        ReturnRequest request = service.createRequest(orderId, reason, type);
        return ResponseEntity.status(HttpStatus.CREATED).body(request);
    }

    @PutMapping(value = "/{id}/approve")
    public ResponseEntity<ReturnRequest> approve(@PathVariable("id") Long id) {
        try {
            ReturnRequest request = service.approveRequest(id);
            return ResponseEntity.ok().body(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping(value = "/{id}/reject")
    public ResponseEntity<ReturnRequest> reject(@PathVariable("id") Long id) {
        try {
            ReturnRequest request = service.rejectRequest(id);
            return ResponseEntity.ok().body(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping(value = "/{id}/confirm-refund")
    public ResponseEntity<ReturnRequest> confirmRefund(
            @PathVariable("id") Long id,
            @RequestBody Map<String, String> payload) {
        if (!payload.containsKey("refundMethod") || !payload.containsKey("refundNote")) {
            return ResponseEntity.badRequest().build();
        }
        String refundMethod = payload.get("refundMethod");
        String refundNote = payload.get("refundNote");

        try {
            ReturnRequest request = service.confirmRefund(id, refundMethod, refundNote);
            return ResponseEntity.ok().body(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
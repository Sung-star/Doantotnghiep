package com.example.ecommerce.resources;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.ecommerce.entities.Voucher;
import com.example.ecommerce.services.VoucherService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/api/vouchers")
public class VoucherResource {

    @Autowired
    private VoucherService service;

    @GetMapping
    public ResponseEntity<List<Voucher>> findAll() {
        List<Voucher> list = service.findAll();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Voucher> findById(@PathVariable Long id) {
        Voucher obj = service.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    @PostMapping
    public ResponseEntity<Voucher> insert(@RequestBody Voucher obj) {
        obj = service.insert(obj);
        return ResponseEntity.ok().body(obj);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Voucher> update(@PathVariable Long id, @RequestBody Voucher obj) {
        obj = service.update(id, obj);
        return ResponseEntity.ok().body(obj);
    }
}

package com.example.ecommerce.resources;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.ecommerce.entities.UserAddress;
import com.example.ecommerce.services.AddressService;

@RestController
@RequestMapping(value = "/api/addresses")
@CrossOrigin(origins = "*")
public class AddressResource {

    @Autowired
    private AddressService service;

    @GetMapping(value = "/user/{userId}")
    public ResponseEntity<List<UserAddress>> findByUserId(@PathVariable Long userId) {
        List<UserAddress> list = service.findByUserId(userId);
        return ResponseEntity.ok().body(list);
    }

    @PostMapping(value = "/user/{userId}")
    public ResponseEntity<UserAddress> insert(@PathVariable Long userId, @RequestBody UserAddress obj) {
        obj = service.insert(userId, obj);
        return ResponseEntity.ok().body(obj);
    }

    @PutMapping(value = "/{id}/set-default/user/{userId}")
    public ResponseEntity<Void> setDefault(@PathVariable Long id, @PathVariable Long userId) {
        service.setDefault(userId, id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

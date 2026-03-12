package com.example.ecommerce.entities;

import com.fasterxml.jackson.annotation.JsonProperty; // Thêm import này
import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "tb_role")
public class Role implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("authority") // Ép Jackson gửi về tên "authority"
    private String authority; 

    public Role() {}
    public Role(Long id, String authority) { 
        this.id = id; 
        this.authority = authority; 
    }

    // --- PHẢI CÓ ĐẦY ĐỦ GETTER/SETTER ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAuthority() { return authority; }
    public void setAuthority(String authority) { this.authority = authority; }
}
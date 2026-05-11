package com.example.ecommerce.entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "wards")
public class Ward {
    @Id
    private Long id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "district_id")
    @JsonIgnore
    private District district;

    public Ward() {}
    public Ward(Long id, String name, District district) {
        this.id = id;
        this.name = name;
        this.district = district;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public District getDistrict() { return district; }
    public void setDistrict(District district) { this.district = district; }
}

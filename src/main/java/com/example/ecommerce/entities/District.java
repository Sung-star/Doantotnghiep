package com.example.ecommerce.entities;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "districts")
public class District {
    @Id
    private Long id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "province_id")
    @JsonIgnore
    private Province province;

    @OneToMany(mappedBy = "district", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Ward> wards;

    public District() {}
    public District(Long id, String name, Province province) {
        this.id = id;
        this.name = name;
        this.province = province;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Province getProvince() { return province; }
    public void setProvince(Province province) { this.province = province; }
}

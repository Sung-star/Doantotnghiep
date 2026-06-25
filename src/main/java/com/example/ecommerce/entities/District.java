package com.example.ecommerce.entities;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "districts")
public class District {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String code; // Mã quận

    @ManyToOne
    @JoinColumn(name = "province_id")
    @JsonIgnore
    private Province province;

    // Khoảng cách từ hub chính (km)
    @Column
    private Double distanceFromHub = 0.0;

    // Phí vận chuyển cơ bản
    @Column(nullable = false)
    private Double baseShippingFee = 30000.0;

    @OneToMany(mappedBy = "district", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Ward> wards;

    @Column(nullable = false)
    private Boolean active = true;

    public District() {}
    public District(Long id, String name, Province province) {
        this.id = id;
        this.name = name;
        this.province = province;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Province getProvince() { return province; }
    public void setProvince(Province province) { this.province = province; }

    public Double getDistanceFromHub() { return distanceFromHub; }
    public void setDistanceFromHub(Double distanceFromHub) { this.distanceFromHub = distanceFromHub; }

    public Double getBaseShippingFee() { return baseShippingFee; }
    public void setBaseShippingFee(Double baseShippingFee) { this.baseShippingFee = baseShippingFee; }

    public List<Ward> getWards() { return wards; }
    public void setWards(List<Ward> wards) { this.wards = wards; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}

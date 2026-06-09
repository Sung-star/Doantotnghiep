package com.example.ecommerce.entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "wards")
public class Ward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String code; // Mã phường

    @ManyToOne
    @JoinColumn(name = "district_id", nullable = false)
    @JsonIgnore
    private District district;

    // Phí vận chuyển bổ sung cho phường này
    @Column
    private Double additionalShippingFee = 0.0;

    @Column(nullable = false)
    private Boolean active = true;

    public Ward() {}
    public Ward(Long id, String name, District district) {
        this.id = id;
        this.name = name;
        this.district = district;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public District getDistrict() { return district; }
    public void setDistrict(District district) { this.district = district; }

    public Double getAdditionalShippingFee() { return additionalShippingFee; }
    public void setAdditionalShippingFee(Double additionalShippingFee) { this.additionalShippingFee = additionalShippingFee; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}

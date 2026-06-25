package com.example.ecommerce.entities;

import java.io.Serializable;
import java.time.Instant;
import com.example.ecommerce.entities.enums.ReturnStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "return_requests")
public class ReturnRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private String reason;
    private String type; // "RETURN" or "EXCHANGE"
    private Integer status; // maps to ReturnStatus code

    private Double refundAmount;
    private String refundMethod;
    private String refundNote;
    private Instant createdAt;

    public ReturnRequest() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public ReturnStatus getStatus() {
        return status != null ? ReturnStatus.valueOf(status) : null;
    }
    public void setStatus(ReturnStatus returnStatus) {
        if (returnStatus != null) {
            this.status = returnStatus.getCode();
        }
    }

    public Double getRefundAmount() { return refundAmount; }
    public void setRefundAmount(Double refundAmount) { this.refundAmount = refundAmount; }

    public String getRefundMethod() { return refundMethod; }
    public void setRefundMethod(String refundMethod) { this.refundMethod = refundMethod; }

    public String getRefundNote() { return refundNote; }
    public void setRefundNote(String refundNote) { this.refundNote = refundNote; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
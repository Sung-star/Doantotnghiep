package com.example.ecommerce.entities;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Id; // Thay đổi ở đây
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "payments")
public class Payment implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id // KHÔNG dùng @GeneratedValue vì ID lấy từ Order
	private Long id;
	private Instant moment;

	@JsonIgnore
	@OneToOne
	@MapsId
	@JoinColumn(name = "order_id") // Thêm cột liên kết rõ ràng
	private Order order;
	
	public Payment() {
	}

	public Payment(Long id, Instant moment, Order order) {
		super();
		this.id = id;
		this.moment = moment;
		this.order = order;
	}

    // --- Các Getter/Setter giữ nguyên ---
	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public Instant getMoment() { return moment; }
	public void setMoment(Instant moment) { this.moment = moment; }
	public Order getOrder() { return order; }
	public void setOrder(Order order) { this.order = order; }

	@Override
	public int hashCode() { return Objects.hash(id); }

	@Override
	public boolean equals(Object obj) {
		if (this == obj) return true;
		if (obj == null || getClass() != obj.getClass()) return false;
		Payment other = (Payment) obj;
		return Objects.equals(id, other.id);
	}
}
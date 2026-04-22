package com.example.ecommerce.entities.enums;

public enum OrderStatus {
	
	PENDING(1),
	CONFIRMED(2),
	SHIPPING(3),
	DELIVERED(4),
	COMPLETED(5),
	CANCELLED(6),
	PAID(7),
	WAITING_PAYMENT(8);
	
	private int orderStatusCode;
	
	private OrderStatus(int orderStatusCode) {
		this.orderStatusCode = orderStatusCode;
	}
	
	public int getStatusCode() {
		return orderStatusCode;
	}
	
	public static OrderStatus valueOf(int orderStatusCode) {
		for(OrderStatus value : OrderStatus.values()) {
			if(value.getStatusCode() == orderStatusCode) {
				return value;
			}
		}
		throw new IllegalArgumentException("Invalid orderStatusCode: " + orderStatusCode);
	}
}

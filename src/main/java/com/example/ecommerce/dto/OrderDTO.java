package com.example.ecommerce.dto;

import java.util.List;

public class OrderDTO {
    private Long clientId;
    private List<CartItemDTO> items;
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;

    public OrderDTO() {}

    // --- GETTERS AND SETTERS ---

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }

    public List<CartItemDTO> getItems() { return items; }
    public void setItems(List<CartItemDTO> items) { this.items = items; }

    public String getShippingName() { return shippingName; }
    public void setShippingName(String shippingName) { this.shippingName = shippingName; }

    public String getShippingPhone() { return shippingPhone; }
    public void setShippingPhone(String shippingPhone) { this.shippingPhone = shippingPhone; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
}
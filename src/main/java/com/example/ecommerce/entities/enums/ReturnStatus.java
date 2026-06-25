package com.example.ecommerce.entities.enums;

public enum ReturnStatus {
    PENDING(1),
    APPROVED(2),
    REJECTED(3),
    REFUND_COMPLETED(4);

    private final int code;

    private ReturnStatus(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static ReturnStatus valueOf(int code) {
        for (ReturnStatus value : ReturnStatus.values()) {
            if (value.getCode() == code) {
                return value;
            }
        }
        throw new IllegalArgumentException("Invalid ReturnStatus code: " + code);
    }
}
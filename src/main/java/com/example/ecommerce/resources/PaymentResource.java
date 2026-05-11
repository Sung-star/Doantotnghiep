package com.example.ecommerce.resources;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecommerce.config.VnPayConfig;
import com.example.ecommerce.entities.enums.OrderStatus;
import com.example.ecommerce.services.OrderService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentResource {

    @Autowired
    private OrderService orderService;

    // Cấu hình Return URL trong application.properties
    // Ví dụ: vnpay.returnUrl=http://localhost:8080/api/payment/vnpay-callback
    @Value("${vnpay.returnUrl:http://localhost:8080/api/payment/vnpay-callback}")
    private String vnp_ReturnUrl;

    @PostMapping("/create-payment")
    public ResponseEntity<?> createPayment(HttpServletRequest req, @RequestBody Map<String, Object> payload) throws UnsupportedEncodingException {

        // 1. Lấy dữ liệu an toàn từ payload
        long amount = 0;
        Object amountObj = payload.get("amount");
        if (amountObj instanceof Number) {
            amount = ((Number) amountObj).longValue() * 100;
        } else if (amountObj != null) {
            amount = (long) (Double.parseDouble(amountObj.toString()) * 100);
        }
        
        String orderId = String.valueOf(payload.get("orderId"));
        String vnp_TxnRef = orderId;
        String vnp_IpAddr = VnPayConfig.getIpAddress(req);

        // 2. Thiết lập tham số VNPAY
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VnPayConfig.vnp_Version);
        vnp_Params.put("vnp_Command", VnPayConfig.vnp_Command);
        vnp_Params.put("vnp_TmnCode", VnPayConfig.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang #" + orderId);
        vnp_Params.put("vnp_OrderType", VnPayConfig.vnp_OrderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        // 3. Xử lý thời gian (Asia/Ho_Chi_Minh)
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // 4. Build Query và Hash Data
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                if (hashData.length() > 0) {
                    hashData.append('&');
                    query.append('&');
                }
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + queryUrl;

        return ResponseEntity.ok(Map.of("url", paymentUrl));
    }

    @GetMapping("/vnpay-callback")
    public ResponseEntity<Void> vnPayCallback(HttpServletRequest request) throws UnsupportedEncodingException {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = fields.get("vnp_SecureHash");
        fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        // Sắp xếp tham số để kiểm tra chữ ký
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0) && fieldName.startsWith("vnp_")) {
                if (hashData.length() > 0) {
                    hashData.append('&');
                }
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
            }
        }

        String secureHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData.toString());
        String responseCode = fields.get("vnp_ResponseCode");
        String orderId = fields.get("vnp_TxnRef");
        String frontendUrl;

        if (secureHash.equalsIgnoreCase(vnp_SecureHash)) {
            if ("00".equals(responseCode)) {
                try {
                    orderService.updateStatus(Long.parseLong(orderId), OrderStatus.PAID);
                    frontendUrl = "http://localhost:3000/payment-result?status=success&orderId=" + orderId;
                } catch (Exception e) {
                    frontendUrl = "http://localhost:3000/payment-result?status=error&message=OrderUpdateFailed";
                }
            } else {
                frontendUrl = "http://localhost:3000/payment-result?status=failed&orderId=" + orderId;
            }
        } else {
            frontendUrl = "http://localhost:3000/payment-result?status=error&message=InvalidSignature";
        }

        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", frontendUrl)
                .build();
    }
}
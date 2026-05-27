package com.example.ecommerce.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.ecommerce.entities.Order;
import com.example.ecommerce.entities.OrderItem;
import com.example.ecommerce.entities.Voucher;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            System.out.println("HTML Email sent successfully to " + to);
        } catch (Exception e) {
            System.err.println("Failed to send HTML email: " + e.getMessage());
        }
    }

    public void sendOrderConfirmation(Order order) {
        String subject = "🏀 XÁC NHẬN ĐƠN HÀNG #" + order.getId() + " - SPORTING SHOP";
        
        StringBuilder itemsHtml = new StringBuilder();
        for (OrderItem item : order.getItems()) {
            itemsHtml.append("<tr>")
                .append("<td style='padding: 10px; border-bottom: 1px solid #eee;'>")
                .append("<div style='font-weight: bold;'>").append(item.getProduct().getName()).append("</div>")
                .append("<div style='font-size: 12px; color: #666;'>Size: ").append(item.getSize()).append("</div>")
                .append("</td>")
                .append("<td style='padding: 10px; border-bottom: 1px solid #eee; text-align: center;'>").append(item.getQuantity()).append("</td>")
                .append("<td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'>")
                .append(String.format("%,.0f", item.getPrice() * item.getQuantity())).append("đ</td>")
                .append("</tr>");
        }

        String htmlBody = "<html><body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
            "<div style='max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-top: 5px solid #000;'>" +
            "  <div style='background: #000; color: #fff; padding: 20px; text-align: center;'>" +
            "    <h1 style='margin: 0; text-transform: uppercase; letter-spacing: 2px;'>Sporting Shop</h1>" +
            "  </div>" +
            "  <div style='padding: 30px;'>" +
            "    <h2>Chào " + order.getShippingName() + ",</h2>" +
            "    <p>Cảm ơn bạn đã tin tưởng và đặt hàng tại <strong>Sporting Shop</strong>!</p>" +
            "    <p>Chúng tôi đã nhận được đơn hàng của bạn và đang chuẩn bị xử lý.</p>" +
            "    <div style='background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;'>" +
            "      <h3 style='margin-top: 0;'>Thông tin đơn hàng</h3>" +
            "      <p style='margin: 5px 0;'><strong>Mã đơn hàng:</strong> #ORD-" + order.getId() + "</p>" +
            "      <p style='margin: 5px 0;'><strong>Địa chỉ:</strong> " + order.getShippingAddress() + "</p>" +
            "      <p style='margin: 5px 0;'><strong>Điện thoại:</strong> " + order.getShippingPhone() + "</p>" +
            "    </div>" +
            "    <table style='width: 100%; border-collapse: collapse;'>" +
            "      <thead><tr style='background: #eee;'><th style='padding: 10px; text-align: left;'>Sản phẩm</th><th style='padding: 10px;'>SL</th><th style='padding: 10px; text-align: right;'>Tổng</th></tr></thead>" +
            "      <tbody>" + itemsHtml.toString() + "</tbody>" +
            "    </table>" +
            "    <div style='text-align: right; margin-top: 20px;'>" +
            "      <p style='margin: 5px 0;'>Phí vận chuyển: " + String.format("%,.0f", order.getShippingFee()) + "đ</p>" +
            (order.getDiscountAmount() > 0 ? "      <p style='margin: 5px 0; color: red;'>Giảm giá: -" + String.format("%,.0f", order.getDiscountAmount()) + "đ</p>" : "") +
            "      <h2 style='margin: 5px 0;'>Tổng cộng: " + String.format("%,.0f", order.getTotal()) + "đ</h2>" +
            "    </div>" +
            "    <div style='text-align: center; margin-top: 40px;'>" +
            "      <a href='http://localhost:3000/orders' style='background: #000; color: #fff; text-decoration: none; padding: 15px 30px; text-transform: uppercase; font-weight: bold;'>Theo dõi đơn hàng</a>" +
            "    </div>" +
            "  </div>" +
            "  <div style='background: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #999;'>" +
            "    &copy; 2025 Sporting Shop - All Rights Reserved.<br>123 Đường Thể Thao, TP. Hồ Chí Minh" +
            "  </div>" +
            "</div>" +
            "</body></html>";

        sendHtmlEmail(order.getClient().getEmail(), subject, htmlBody);
    }

    public void sendStatusUpdate(Order order) {
        String subject = "📦 CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG #" + order.getId();
        String statusText = order.getOrderStatus().toString();

        String htmlBody = "<html><body style='font-family: Arial, sans-serif;'>" +
            "<div style='max-width: 600px; margin: 0 auto; border: 1px solid #ddd;'>" +
            "  <div style='background: #000; color: #fff; padding: 15px; text-align: center;'><h3>Sporting Shop Update</h3></div>" +
            "  <div style='padding: 30px;'>" +
            "    <p>Chào <strong>" + order.getShippingName() + "</strong>,</p>" +
            "    <p>Trạng thái đơn hàng <strong>#ORD-" + order.getId() + "</strong> của bạn đã được cập nhật thành:</p>" +
            "    <div style='text-align: center; padding: 20px; background: #e7f3ff; color: #004085; font-weight: bold; font-size: 24px; text-transform: uppercase; margin: 20px 0;'>" +
            statusText + "</div>" +
            "    <p>Vui lòng đăng nhập vào website để xem chi tiết.</p>" +
            "    <p>Cảm ơn bạn đã đồng hành cùng chúng tôi!</p>" +
            "  </div>" +
            "</div>" +
            "</body></html>";

        sendHtmlEmail(order.getClient().getEmail(), subject, htmlBody);
    }

    public void sendNewVoucherNotification(String email, Voucher voucher) {
        String subject = "🎁 QUÀ TẶNG BẤT NGỜ: MÃ GIẢM GIÁ " + voucher.getCode() + " ĐÃ SẴN SÀNG!";
        String htmlBody = "<html><body style='font-family: Arial, sans-serif;'>" +
            "<div style='max-width: 600px; margin: 0 auto; border: 2px dashed #000; padding: 20px; text-align: center;'>" +
            "  <h2 style='color: #d9534f;'>CHỈ DÀNH RIÊNG CHO BẠN!</h2>" +
            "  <p>Sử dụng mã dưới đây để nhận ưu đãi cực khủng khi mua sắm tại <strong>Sporting Shop</strong>:</p>" +
            "  <div style='background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; border: 1px solid #ddd; margin: 20px 0;'>" +
            voucher.getCode() + "</div>" +
            "  <p><strong>Ưu đãi:</strong> Giảm ngay " + voucher.getDiscountPercent() + "% cho đơn hàng từ " + String.format("%,.0f", voucher.getMinOrderAmount()) + "đ</p>" +
            "  <p style='font-size: 12px; color: #777;'>*Hạn sử dụng đến: " + voucher.getExpiryDate().toString() + "</p>" +
            "  <a href='http://localhost:3000' style='background: #000; color: #fff; padding: 10px 20px; text-decoration: none; font-weight: bold;'>MUA SẮM NGAY</a>" +
            "</div>" +
            "</body></html>";
        sendHtmlEmail(email, subject, htmlBody);
    }
}

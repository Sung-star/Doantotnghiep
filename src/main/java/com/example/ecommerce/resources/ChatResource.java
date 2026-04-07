package com.example.ecommerce.resources;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.ecommerce.services.ProductService;

@RestController
@RequestMapping(value = "/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatResource {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ProductService productService;

    private final String API_KEY = "AIzaSyBpwKkxgP5JHtug42DxLyF_wMhZ2fxPlnM";
    private final String URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
            + API_KEY;

    @PostMapping
    public Map<String, String> askAI(@RequestBody Map<String, String> request) {
        String userMsg = request.get("message");

        try {
            // 1. Lấy dữ liệu sản phẩm
            var products = productService.findAll(PageRequest.of(0, 15)).getContent();

            // 2. TẠO PROMPT MỚI (PHẢI NẰM Ở ĐÂY)
            String prompt = "Bạn là nhân viên tư vấn của 'Sporting Shop'.\n"
                    + "Danh sách sản phẩm: " + products.toString() + "\n"
                    + "Yêu cầu: Khi giới thiệu sản phẩm, hãy LUÔN viết kèm mã này ở cuối câu trả lời: "
                    + "[PRODUCT: ID|Tên|Giá|URL_Ảnh]\n"
                    + "Hãy thay thế ID, Tên, Giá, URL_Ảnh tương ứng từ danh sách trên.\n"
                    + "Khách hỏi: " + userMsg;

            Map<String, Object> textObj = Map.of("text", prompt);
            Map<String, Object> partsObj = Map.of("parts", List.of(textObj));
            Map<String, Object> body = Map.of("contents", List.of(partsObj));

            // 3. Gửi request
            Map<String, Object> response = restTemplate.postForObject(URL, body, Map.class);

            List candidates = (List) response.get("candidates");
            Map firstCandidate = (Map) candidates.get(0);
            Map content = (Map) firstCandidate.get("content");
            List resParts = (List) content.get("parts");
            String aiReply = ((Map) resParts.get(0)).get("text").toString();

            return Map.of("reply", aiReply);

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("reply", "Lỗi: " + e.getMessage());
        }
    }
}
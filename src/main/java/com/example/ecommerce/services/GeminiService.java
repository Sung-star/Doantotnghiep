package com.example.ecommerce.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiService {

    @Value("${app.gemini.api-key}")
    private String apiKey;

    @Value("${app.gemini.base-url}")
    private String baseUrl;

    @Autowired
    private RestTemplate restTemplate;

    public Map<String, Object> parseSearchQuery(String userQuery) {
        String prompt = "Bạn là trợ lý bán hàng chuyên biệt cho cửa hàng Adidas. " +
                "Hãy phân tích yêu cầu tìm kiếm của khách hàng và chuyển nó thành JSON. " +
                "Vì cửa hàng CHỈ bán đồ ADIDAS, bạn hãy bỏ qua các thương hiệu khác nếu khách nhắc tới. " +
                "JSON trả về phải có các trường: keyword (chuỗi), minPrice (số), maxPrice (số), color (chuỗi), brand (luôn là 'Adidas'), size (chuỗi). " +
                "Nếu không có thông tin cụ thể cho một trường, hãy để null (trừ brand). " +
                "Câu truy vấn: \"" + userQuery + "\" " +
                "Chỉ trả về duy nhất chuỗi JSON, không giải thích.";

        try {
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(Map.of(
                            "parts", List.of(Map.of("text", prompt))
                    ))
            );

            String url = baseUrl + "?key=" + apiKey;
            String response = restTemplate.postForObject(url, requestBody, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            String textResponse = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
            // Làm sạch chuỗi JSON nếu Gemini trả về kèm dấu nháy ```json
            textResponse = textResponse.replace("```json", "").replace("```", "").trim();

            return mapper.readValue(textResponse, Map.class);
        } catch (Exception e) {
            e.printStackTrace();
            return new HashMap<>();
        }
    }
}

package com.example.ecommerce.resources;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadResource {

    private final String UPLOAD_DIR = "uploads";

    @PostMapping("/product")
    public ResponseEntity<String> uploadProductImage(@RequestParam("file") MultipartFile file) {
        return uploadFile(file, "products");
    }

    @PostMapping("/avatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") MultipartFile file) {
        return uploadFile(file, "avatars");
    }

    @PostMapping("/chat")
    public ResponseEntity<String> uploadChatImage(@RequestParam("file") MultipartFile file) {
        return uploadFile(file, "chat");
    }

    private ResponseEntity<String> uploadFile(MultipartFile file, String subDir) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Vui lòng chọn file!");
        }

        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + "/" + subDir + "/" + fileName);
            
            // Đảm bảo thư mục tồn tại
            Files.createDirectories(path.getParent());
            
            Files.copy(file.getInputStream(), path);

            // Trả về đường dẫn để lưu vào DB
            String fileUrl = "/uploads/" + subDir + "/" + fileName;
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Lỗi khi upload file: " + e.getMessage());
        }
    }
}

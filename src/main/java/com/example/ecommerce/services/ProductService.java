package com.example.ecommerce.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ecommerce.entities.Product;
import com.example.ecommerce.repositories.ProductRepository;
import com.example.ecommerce.repositories.ProductSizeRepository;

import java.util.List;

@Service
public class ProductService {

    @Autowired private ProductRepository repository;
    @Autowired private ProductSizeRepository sizeRepository;

    public Page<Product> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Product findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // --- Phương thức mới để tìm các phiên bản màu khác ---
    public List<Product> findVariants(Long id) {
        Product product = findById(id);
        return repository.findByNameAndIdNot(product.getName(), id);
    }

    @Transactional
    public Product insert(Product obj) {
        if (obj.getProductSizes() != null) {
            obj.getProductSizes().forEach(ps -> ps.setProduct(obj));
        }
        return repository.save(obj);
    }

    @Transactional
    public Product update(Long id, Product obj) {
        try {
            Product entity = repository.getReferenceById(id);
            updateData(entity, obj);
            
            // Cập nhật danh sách Size
            if (obj.getProductSizes() != null) {
                entity.getProductSizes().clear();
                obj.getProductSizes().forEach(ps -> {
                    ps.setProduct(entity);
                    entity.getProductSizes().add(ps);
                });
            }
            return repository.save(entity);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi cập nhật: " + id);
        }
    }

    public void delete(Long id) {
        try {
            repository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            // Sửa lỗi khi xóa sản phẩm đã có đơn hàng
            throw new RuntimeException("Sản phẩm đã có đơn hàng, không thể xóa!");
        }
    }
public Page<Product> findByName(String name, Pageable pageable) {
    return repository.findByNameContainingIgnoreCase(name, pageable);
}

// Tìm kiếm với bộ lọc bổ sung: màu và thương hiệu
public Page<Product> findByFilters(String name, String color, String brand, Pageable pageable) {
    return repository.findByFilters(name, color, brand, pageable);
}
    private void updateData(Product entity, Product obj) {
        entity.setName(obj.getName());
        entity.setPrice(obj.getPrice());
        entity.setImgUrl(obj.getImgUrl());
        entity.setDescription(obj.getDescription());
        // mới thêm
        entity.setColor(obj.getColor());
        entity.setBrand(obj.getBrand());
    }
}
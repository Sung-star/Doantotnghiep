package com.example.ecommerce.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ecommerce.entities.Product;
import com.example.ecommerce.entities.ProductVariant;
import com.example.ecommerce.entities.ProductSize;
import com.example.ecommerce.entities.SizeType;
import com.example.ecommerce.repositories.ProductRepository;
import com.example.ecommerce.repositories.ProductSizeRepository;
import com.example.ecommerce.specifications.ProductSpecification;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Set;

@Service
public class ProductService {

    @Autowired private ProductRepository repository;
    @Autowired private ProductSizeRepository sizeRepository;
    @Autowired private CategoryService categoryService;

    public Page<Product> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Product findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
    }

    @Transactional
    public Product insert(Product obj) {
        // 1. Gán thương hiệu mặc định
        if (obj.getBrand() == null || obj.getBrand().trim().isEmpty()) {
            obj.setBrand("Adidas");
        }

        // 2. TỰ ĐỘNG PHÂN LOẠI SIZE (ALPHA / NUMERIC)
        autoSetSizeType(obj);

        // 3. Đồng bộ Mapping cho Variants và Sizes (Tạo mặc định nếu chưa có)
        if (obj.getVariants() == null || obj.getVariants().isEmpty()) {
            createDefaultVariant(obj);
        }
        
        obj.getVariants().forEach(variant -> {
            variant.setProduct(obj);
            if (variant.getProductSizes() != null) {
                variant.getProductSizes().forEach(size -> size.setProductVariant(variant));
            }
        });
        return repository.save(obj);
    }

    @Transactional
    public Product update(Long id, Product obj) {
        Product entity = findById(id);
        
        // 1. Cập nhật thông tin cơ bản
        entity.setName(obj.getName());
        entity.setPrice(obj.getPrice());
        entity.setDescription(obj.getDescription());
        entity.setBrand(obj.getBrand());
        
        // 2. Cập nhật Categories và cập nhật lại SizeType nếu cần
        if (obj.getCategories() != null && !obj.getCategories().isEmpty()) {
            entity.getCategories().clear();
            entity.getCategories().addAll(obj.getCategories());
            autoSetSizeType(entity);
        }

        // 3. FIX BUG QUAN TRỌNG: UPDATE SIZE KHÔNG BỊ NULL
        if (obj.getVariants() != null && !obj.getVariants().isEmpty()) {
            ProductVariant incomingV = obj.getVariants().iterator().next();
            
            // Tìm variant tương ứng hoặc lấy cái đầu tiên
            ProductVariant targetV = entity.getVariants().isEmpty() 
                ? createDefaultVariant(entity) 
                : entity.getVariants().iterator().next();

            targetV.setColor(incomingV.getColor() != null ? incomingV.getColor() : targetV.getColor());
            
            if (incomingV.getImgUrl() != null && !incomingV.getImgUrl().isEmpty()) {
                targetV.setImgUrl(incomingV.getImgUrl());
                entity.setImgUrl(incomingV.getImgUrl());
            }

            // --- ĐÂY LÀ PHẦN FIX BUG: Chỉ update size khi có dữ liệu mới ---
            if (incomingV.getProductSizes() != null && !incomingV.getProductSizes().isEmpty()) {
                System.out.println(">>> Cập nhật danh sách size mới cho sản phẩm: " + entity.getName());
                targetV.getProductSizes().clear();
                for (ProductSize sizeDto : incomingV.getProductSizes()) {
                    sizeDto.setProductVariant(targetV);
                    targetV.getProductSizes().add(sizeDto);
                }
            } else {
                System.out.println(">>> Giữ nguyên danh sách size cũ cho sản phẩm: " + entity.getName());
            }
        }
        
        return repository.save(entity);
    }

    private void autoSetSizeType(Product product) {
        if (product.getCategories() == null || product.getCategories().isEmpty()) {
            product.setSizeType(SizeType.ALPHA);
            return;
        }

        boolean isShoes = product.getCategories().stream()
                .anyMatch(c -> c != null && c.getName() != null && (
                              c.getName().toUpperCase().contains("GIÀY") || 
                              c.getName().toUpperCase().contains("SHOES") ||
                              c.getName().toUpperCase().contains("FOOTWEAR")));
        
        product.setSizeType(isShoes ? SizeType.NUMERIC : SizeType.ALPHA);
    }

    private ProductVariant createDefaultVariant(Product product) {
        ProductVariant v = new ProductVariant();
        v.setColor("Gốc");
        v.setProduct(product);
        product.getVariants().add(v);
        return v;
    }

    public Set<ProductVariant> findVariants(Long id) {
        Product p = findById(id);
        return p.getVariants();
    }

    public void delete(Long id) {
        try {
            repository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Sản phẩm đã có đơn hàng hoặc dữ liệu liên quan, không thể xóa!");
        }
    }

    public Page<Product> findWithDynamicFilter(String keyword, List<Long> categoryIds, Double minPrice, Double maxPrice, String color, String brand, String productSize, Pageable pageable) {
        Specification<Product> spec = Specification.where(null);
        if (keyword != null && !keyword.trim().isEmpty()) spec = spec.and(ProductSpecification.hasNameContaining(keyword));
        if (categoryIds != null && !categoryIds.isEmpty()) spec = spec.and(ProductSpecification.hasCategoryIn(categoryService.getAllChildIds(categoryIds)));
        if (minPrice != null && maxPrice != null) spec = spec.and(ProductSpecification.hasPriceBetween(minPrice, maxPrice));
        if (color != null && !color.trim().isEmpty()) spec = spec.and(ProductSpecification.hasColor(color));
        if (brand != null && !brand.trim().isEmpty()) spec = spec.and(ProductSpecification.hasBrand(brand));
        if (productSize != null && !productSize.trim().isEmpty()) spec = spec.and(ProductSpecification.hasSize(productSize));
        return repository.findAll(spec, pageable);
    }
}
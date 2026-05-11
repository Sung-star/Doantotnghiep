package com.example.ecommerce.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ecommerce.entities.Voucher;
import com.example.ecommerce.repositories.VoucherRepository;

@Service
public class VoucherService {

    @Autowired
    private VoucherRepository repository;

    public List<Voucher> findAll() {
        return repository.findAll();
    }

    public Voucher findById(Long id) {
        Optional<Voucher> obj = repository.findById(id);
        return obj.orElseThrow(() -> new RuntimeException("Voucher không tồn tại!"));
    }

    @Transactional
    public Voucher insert(Voucher obj) {
        return repository.save(obj);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public Voucher update(Long id, Voucher obj) {
        Voucher entity = repository.getReferenceById(id);
        updateData(entity, obj);
        return repository.save(entity);
    }

    private void updateData(Voucher entity, Voucher obj) {
        entity.setCode(obj.getCode());
        entity.setDescription(obj.getDescription());
        entity.setDiscountPercent(obj.getDiscountPercent());
        entity.setMaxDiscountAmount(obj.getMaxDiscountAmount());
        entity.setMinOrderAmount(obj.getMinOrderAmount());
        entity.setExpiryDate(obj.getExpiryDate());
        entity.setActive(obj.getActive());
    }
}

package com.localinventory.inventory_api.category.repository;

import com.localinventory.inventory_api.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAllByShopId(Long shopId);
    Optional<Category> findByIdAndShopId(Long id, Long shopId);
    Boolean existsByNameAndShopId(String name, Long shopId);
}
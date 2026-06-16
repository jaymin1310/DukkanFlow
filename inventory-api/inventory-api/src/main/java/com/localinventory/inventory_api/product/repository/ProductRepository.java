package com.localinventory.inventory_api.product.repository;

import com.localinventory.inventory_api.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Boolean existsBySkuAndShopId(String sku, Long shopId);

    Optional<Product> findByIdAndShopId(Long id, Long shopId);

    @Query("SELECT p FROM Product p WHERE p.shop.id = :shopId AND p.active = true AND " +
            "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> searchByShop(Long shopId, String search, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.shop.id = :shopId AND p.active = true AND p.stockQuantity <= p.lowStockThreshold")
    List<Product> findLowStockByShop(Long shopId);

    long countByShopId(Long shopId);

    @Query("SELECT p FROM Product p WHERE p.shop.id = :shopId AND p.name = :name")
    Optional<Product> findByShopIdAndName(Long shopId, String name);
}
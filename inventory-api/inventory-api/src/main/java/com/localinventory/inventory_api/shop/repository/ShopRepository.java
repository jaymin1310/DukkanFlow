package com.localinventory.inventory_api.shop.repository;

import com.localinventory.inventory_api.shop.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findByEmail(String email);
    Optional<Shop> findByMobile(String mobile);
    Boolean existsByEmail(String email);
    Boolean existsByMobile(String mobile);
}

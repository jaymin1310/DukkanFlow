package com.localinventory.inventory_api.customer.repository;

import com.localinventory.inventory_api.customer.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByIdAndShopId(Long id, Long shopId);

    long countByShopId(Long shopId);

    @Query("SELECT c FROM Customer c WHERE c.shop.id = :shopId AND " +
            "(LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "c.phone LIKE CONCAT('%', :search, '%'))")
    Page<Customer> searchByShop(Long shopId, String search, Pageable pageable);
}
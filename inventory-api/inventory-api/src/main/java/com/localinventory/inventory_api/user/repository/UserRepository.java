package com.localinventory.inventory_api.user.repository;

import com.localinventory.inventory_api.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByShop_Mobile(String mobile);
    Optional<User> findByShop_EmailAndActiveTrue(String email);
    Optional<User> findByShop_MobileAndActiveTrue(String mobile);
    Boolean existsByEmail(String email);
    Boolean existsByEmailAndActiveTrue(String email);
}

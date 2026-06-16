package com.localinventory.inventory_api.security;

import com.localinventory.inventory_api.shop.entity.Shop;
import com.localinventory.inventory_api.user.entity.User;
import com.localinventory.inventory_api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ShopContext {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Shop getCurrentShop() {
        return getCurrentUser().getShop();
    }

    public Long getCurrentShopId() {
        return getCurrentShop().getId();
    }
}
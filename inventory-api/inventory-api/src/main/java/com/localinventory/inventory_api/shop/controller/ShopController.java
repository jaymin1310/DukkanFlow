package com.localinventory.inventory_api.shop.controller;

import com.localinventory.inventory_api.shop.dto.ShopResponse;
import com.localinventory.inventory_api.shop.dto.ShopUpdateRequest;
import com.localinventory.inventory_api.shop.service.ShopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @GetMapping("/profile")
    public ResponseEntity<ShopResponse> getProfile() {
        return ResponseEntity.ok(shopService.getMyShop());
    }

    @PutMapping("/profile")
    public ResponseEntity<ShopResponse> updateProfile(@Valid @RequestBody ShopUpdateRequest request) {
        return ResponseEntity.ok(shopService.updateShop(request));
    }
}
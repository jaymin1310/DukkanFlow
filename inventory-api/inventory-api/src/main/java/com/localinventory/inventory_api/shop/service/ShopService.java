package com.localinventory.inventory_api.shop.service;

import com.localinventory.inventory_api.security.ShopContext;
import com.localinventory.inventory_api.shop.dto.ShopResponse;
import com.localinventory.inventory_api.shop.dto.ShopUpdateRequest;
import com.localinventory.inventory_api.shop.entity.Shop;
import com.localinventory.inventory_api.shop.repository.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final ShopContext shopContext;

    public ShopResponse getMyShop() {
        Shop shop = shopContext.getCurrentShop();
        return mapToResponse(shop);
    }

    public ShopResponse updateShop(ShopUpdateRequest request) {
        Shop shop = shopContext.getCurrentShop();
        shop.setName(request.getName());
        shop.setMobile(request.getMobile());
        shop.setAddress(request.getAddress());
        return mapToResponse(shopRepository.save(shop));
    }

    private ShopResponse mapToResponse(Shop shop) {
        return new ShopResponse(
                shop.getId(),
                shop.getName(),
                shop.getOwnerName(),
                shop.getMobile(),
                shop.getEmail(),
                shop.getAddress(),
                shop.getCreatedAt()
        );
    }
}
package com.localinventory.inventory_api.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ShopResponse {
    private Long id;
    private String name;
    private String ownerName;
    private String mobile;
    private String email;
    private String address;
    private LocalDateTime createdAt;
}
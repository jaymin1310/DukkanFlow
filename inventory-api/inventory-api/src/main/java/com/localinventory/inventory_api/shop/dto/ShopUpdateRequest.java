package com.localinventory.inventory_api.shop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ShopUpdateRequest {
    @NotBlank(message = "Shop name is required")
    private String name;
    private String mobile;
    private String address;
}
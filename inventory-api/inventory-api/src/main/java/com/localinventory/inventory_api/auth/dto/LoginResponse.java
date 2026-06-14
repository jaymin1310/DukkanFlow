package com.localinventory.inventory_api.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String name;
    private String email;
    private String role;
    private String shopName;
    private Long shopId;
}
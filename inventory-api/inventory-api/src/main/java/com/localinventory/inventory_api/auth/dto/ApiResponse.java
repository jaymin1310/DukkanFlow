package com.localinventory.inventory_api.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiResponse {
    private String message;
    private boolean success;
}

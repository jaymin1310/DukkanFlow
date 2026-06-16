package com.localinventory.inventory_api.customer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerRequest {

    @NotBlank(message = "Customer name is required")
    private String name;

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number — must be 10 digits starting with 6-9")
    private String phone;

    private String email;
    private String address;
}
package com.localinventory.inventory_api.auth.dto;

import com.localinventory.inventory_api.user.entity.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile must be a valid 10-digit number")
    private String mobile;

    @NotBlank(message = "Shop name is required")
    private String shopName;

    private String shopAddress;

    private Role role = Role.OWNER;
}
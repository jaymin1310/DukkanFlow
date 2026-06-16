package com.localinventory.inventory_api.product.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "SKU is required")
    private String sku;

    @NotNull(message = "Category is required")
    private Long categoryId;

    @NotNull(message = "Purchase price is required")
    @Positive(message = "Purchase price must be greater than zero")
    private BigDecimal purchasePrice;

    @NotNull(message = "Selling price is required")
    @Positive(message = "Selling price must be greater than zero")
    private BigDecimal sellingPrice;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    private Integer lowStockThreshold = 5;
    private String unit;
}
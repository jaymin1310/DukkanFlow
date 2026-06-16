package com.localinventory.inventory_api.product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String sku;
    private String categoryName;
    private BigDecimal purchasePrice;
    private BigDecimal sellingPrice;
    private Integer stockQuantity;
    private Integer lowStockThreshold;
    private String unit;
    private Boolean active;
    private LocalDateTime createdAt;
    private boolean lowStock;
}
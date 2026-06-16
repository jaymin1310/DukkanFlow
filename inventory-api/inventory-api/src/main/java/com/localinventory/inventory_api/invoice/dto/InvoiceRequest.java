package com.localinventory.inventory_api.invoice.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class InvoiceRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotEmpty(message = "At least one item is required")
    private List<InvoiceItemRequest> items;

    private BigDecimal discount = BigDecimal.ZERO;
    private BigDecimal taxPercent = BigDecimal.ZERO;
    private String paymentMethod = "CASH";
    private String notes;
}
package com.localinventory.inventory_api.invoice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class InvoiceResponse {
    private Long id;
    private String invoiceNumber;
    private String customerName;
    private String createdBy;
    private List<InvoiceItemResponse> items;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal taxPercent;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String paymentStatus;
    private String notes;
    private LocalDateTime createdAt;
}
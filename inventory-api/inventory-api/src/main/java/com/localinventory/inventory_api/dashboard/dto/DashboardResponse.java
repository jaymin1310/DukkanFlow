package com.localinventory.inventory_api.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardResponse {
    private long totalProducts;
    private long totalCustomers;
    private long totalInvoices;
    private long lowStockCount;
    private double totalRevenue;
}
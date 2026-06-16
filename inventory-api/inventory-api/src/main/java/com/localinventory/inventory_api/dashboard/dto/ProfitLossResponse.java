package com.localinventory.inventory_api.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class ProfitLossResponse {
    private double totalRevenue;
    private double totalCost;
    private double totalProfit;
    private double profitMargin;
    private List<ProductProfitDto> productWiseProfit;

    @Data
    @AllArgsConstructor
    public static class ProductProfitDto {
        private String productName;
        private int unitsSold;
        private double revenue;
        private double cost;
        private double profit;
        private double margin;
    }
}
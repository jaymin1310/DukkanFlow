package com.localinventory.inventory_api.dashboard.service;

import com.localinventory.inventory_api.dashboard.dto.ProfitLossResponse;
import com.localinventory.inventory_api.invoice.repository.InvoiceRepository;
import com.localinventory.inventory_api.security.ShopContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfitLossService {

    private final InvoiceRepository invoiceRepository;
    private final ShopContext shopContext;

    public ProfitLossResponse getProfitLoss() {
        Long shopId = shopContext.getCurrentShopId();

        List<Object[]> productSales = invoiceRepository.getProfitLossByShop(shopId);

        double totalRevenue = 0;
        double totalCost = 0;
        List<ProfitLossResponse.ProductProfitDto> productList = new ArrayList<>();

        for (Object[] row : productSales) {
            String productName = (String) row[0];
            long unitsSold = ((Number) row[1]).longValue();
            double revenue = ((Number) row[2]).doubleValue();
            double cost = ((Number) row[3]).doubleValue();
            double profit = revenue - cost;
            double margin = revenue > 0 ? (profit / revenue) * 100 : 0;

            totalRevenue += revenue;
            totalCost += cost;

            productList.add(new ProfitLossResponse.ProductProfitDto(
                    productName,
                    (int) unitsSold,
                    revenue,
                    cost,
                    profit,
                    margin
            ));
        }

        productList.sort((a, b) -> Double.compare(b.getProfit(), a.getProfit()));

        double totalProfit = totalRevenue - totalCost;
        double profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        return new ProfitLossResponse(
                totalRevenue,
                totalCost,
                totalProfit,
                profitMargin,
                productList
        );
    }
}

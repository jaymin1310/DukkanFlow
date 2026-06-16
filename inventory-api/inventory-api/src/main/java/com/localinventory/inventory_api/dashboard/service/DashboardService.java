package com.localinventory.inventory_api.dashboard.service;

import com.localinventory.inventory_api.customer.repository.CustomerRepository;
import com.localinventory.inventory_api.dashboard.dto.DashboardResponse;
import com.localinventory.inventory_api.invoice.repository.InvoiceRepository;
import com.localinventory.inventory_api.product.repository.ProductRepository;
import com.localinventory.inventory_api.security.ShopContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final InvoiceRepository invoiceRepository;
    private final ShopContext shopContext;

    public DashboardResponse getSummary() {
        Long shopId = shopContext.getCurrentShopId();

        long totalProducts = productRepository.countByShopId(shopId);
        long totalCustomers = customerRepository.countByShopId(shopId);
        long totalInvoices = invoiceRepository.countByShopId(shopId);
        long lowStockCount = productRepository.findLowStockByShop(shopId).size();
        Double totalRevenue = invoiceRepository.getTotalRevenueByShop(shopId);

        return new DashboardResponse(
                totalProducts,
                totalCustomers,
                totalInvoices,
                lowStockCount,
                totalRevenue != null ? totalRevenue : 0.0
        );
    }
}
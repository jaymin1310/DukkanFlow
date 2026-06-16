package com.localinventory.inventory_api.invoice.service;

import com.localinventory.inventory_api.customer.entity.Customer;
import com.localinventory.inventory_api.customer.repository.CustomerRepository;
import com.localinventory.inventory_api.exception.InsufficientStockException;
import com.localinventory.inventory_api.invoice.dto.InvoiceItemRequest;
import com.localinventory.inventory_api.invoice.dto.InvoiceRequest;
import com.localinventory.inventory_api.invoice.repository.InvoiceRepository;
import com.localinventory.inventory_api.product.entity.Product;
import com.localinventory.inventory_api.product.repository.ProductRepository;
import com.localinventory.inventory_api.security.ShopContext;
import com.localinventory.inventory_api.shop.entity.Shop;
import com.localinventory.inventory_api.user.entity.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InvoiceServiceTest {

    @Mock private InvoiceRepository invoiceRepository;
    @Mock private ProductRepository productRepository;
    @Mock private CustomerRepository customerRepository;
    @Mock private ShopContext shopContext;

    @InjectMocks
    private InvoiceService invoiceService;

    @Test
    void shouldThrowWhenInsufficientStock() {
        Shop shop = new Shop();
        shop.setId(1L);

        User user = new User();
        user.setShop(shop);

        Customer customer = new Customer();
        customer.setId(1L);
        customer.setTotalPurchases(BigDecimal.ZERO);

        Product product = new Product();
        product.setId(1L);
        product.setName("Football");
        product.setStockQuantity(2); // only 2 in stock
        product.setSellingPrice(BigDecimal.valueOf(900));

        InvoiceItemRequest item = new InvoiceItemRequest();
        item.setProductId(1L);
        item.setQuantity(5); // requesting 5 — more than available

        InvoiceRequest request = new InvoiceRequest();
        request.setCustomerId(1L);
        request.setItems(List.of(item));
        request.setDiscount(BigDecimal.ZERO);
        request.setTaxPercent(BigDecimal.ZERO);
        request.setPaymentMethod("CASH");

        when(shopContext.getCurrentUser()).thenReturn(user);
        when(customerRepository.findByIdAndShopId(1L, 1L))
                .thenReturn(Optional.of(customer));
        when(productRepository.findByIdAndShopId(1L, 1L))
                .thenReturn(Optional.of(product));

        assertThrows(InsufficientStockException.class,
                () -> invoiceService.createInvoice(request));
    }

    @Test
    void shouldThrowWhenCustomerNotFound() {
        Shop shop = new Shop();
        shop.setId(1L);

        User user = new User();
        user.setShop(shop);

        InvoiceRequest request = new InvoiceRequest();
        request.setCustomerId(99L); // non-existent customer
        request.setItems(List.of());
        request.setDiscount(BigDecimal.ZERO);
        request.setTaxPercent(BigDecimal.ZERO);
        request.setPaymentMethod("CASH");

        when(shopContext.getCurrentUser()).thenReturn(user);
        when(customerRepository.findByIdAndShopId(99L, 1L))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> invoiceService.createInvoice(request));
    }
}
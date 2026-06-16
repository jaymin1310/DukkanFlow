package com.localinventory.inventory_api.invoice.service;

import com.localinventory.inventory_api.customer.entity.Customer;
import com.localinventory.inventory_api.customer.repository.CustomerRepository;
import com.localinventory.inventory_api.exception.InsufficientStockException;
import com.localinventory.inventory_api.exception.ResourceNotFoundException;
import com.localinventory.inventory_api.invoice.dto.*;
import com.localinventory.inventory_api.invoice.entity.Invoice;
import com.localinventory.inventory_api.invoice.entity.InvoiceItem;
import com.localinventory.inventory_api.invoice.repository.InvoiceRepository;
import com.localinventory.inventory_api.product.entity.Product;
import com.localinventory.inventory_api.product.repository.ProductRepository;
import com.localinventory.inventory_api.security.ShopContext;
import com.localinventory.inventory_api.shop.entity.Shop;
import com.localinventory.inventory_api.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework. data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final ShopContext shopContext;

    public InvoiceResponse createInvoice(InvoiceRequest request) {
        User currentUser = shopContext.getCurrentUser();
        Shop shop = currentUser.getShop();
        Long shopId = shop.getId();

        Customer customer = customerRepository.findByIdAndShopId(request.getCustomerId(), shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        // Validate stock first before doing anything
        for (InvoiceItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findByIdAndShopId(itemReq.getProductId(), shopId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemReq.getProductId()));
            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new InsufficientStockException(
                        "Insufficient stock for: " + product.getName() +
                                ". Available: " + product.getStockQuantity());
            }
        }

        Invoice invoice = Invoice.builder()
                .invoiceNumber(generateInvoiceNumber(shopId))
                .customer(customer)
                .createdBy(currentUser)
                .shop(shop)
                .discount(request.getDiscount())
                .taxPercent(request.getTaxPercent())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus("PAID")
                .notes(request.getNotes())
                .build();

        List<InvoiceItem> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (InvoiceItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findByIdAndShopId(itemReq.getProductId(), shopId).get();
            BigDecimal itemTotal = product.getSellingPrice()
                    .multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            items.add(InvoiceItem.builder()
                    .invoice(invoice)
                    .product(product)
                    .productName(product.getName())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(product.getSellingPrice())
                    .purchasePrice(product.getPurchasePrice())
                    .totalPrice(itemTotal)
                    .build());

            // Deduct stock
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);
        }

        BigDecimal discountAmount = subtotal.multiply(
                request.getDiscount().divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
        BigDecimal afterDiscount = subtotal.subtract(discountAmount);
        BigDecimal taxAmount = afterDiscount.multiply(
                request.getTaxPercent().divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
        BigDecimal total = afterDiscount.add(taxAmount);

        invoice.setSubtotal(subtotal);
        invoice.setTotalAmount(total);
        invoice.setItems(items);

        // Update customer total purchases
        customer.setTotalPurchases(customer.getTotalPurchases().add(total));
        customerRepository.save(customer);

        return mapToResponse(invoiceRepository.save(invoice));
    }

    public Page<InvoiceResponse> getAll(int page, int size) {
        Long shopId = shopContext.getCurrentShopId();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return invoiceRepository.findAllByShopId(shopId, pageable)
                .map(this::mapToResponse);
    }

    public InvoiceResponse getById(Long id) {
        Long shopId = shopContext.getCurrentShopId();
        return mapToResponse(invoiceRepository.findByIdAndShopId(id, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + id)));
    }

    public String deleteInvoice(Long id) {
        Long shopId = shopContext.getCurrentShopId();
        Invoice invoice = invoiceRepository.findByIdAndShopId(id, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + id));

        invoice.getItems().forEach(item -> {
            Product product = item.getProduct();
            if (product != null) {
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        });

        Customer customer = invoice.getCustomer();
        customer.setTotalPurchases(customer.getTotalPurchases().subtract(invoice.getTotalAmount()));
        customerRepository.save(customer);

        invoiceRepository.delete(invoice);
        return "Invoice deleted successfully";
    }

    public List<InvoiceResponse> getByDateRange(String period) {
        Long shopId = shopContext.getCurrentShopId();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime from = switch (period) {
            case "today" -> now.toLocalDate().atStartOfDay();
            case "week" -> now.minusDays(7);
            case "month" -> now.minusDays(30);
            case "year" -> now.minusDays(365);
            default -> LocalDateTime.of(2000, 1, 1, 0, 0);
        };

        return invoiceRepository.findByShopIdAndDateRange(shopId, from, now)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private String generateInvoiceNumber(Long shopId) {
        String year = String.valueOf(LocalDate.now().getYear());
        String month = String.valueOf(LocalDate.now().getMonthValue());

        // Keep trying until we find a unique number
        long count = invoiceRepository.countByShopId(shopId) + 1;
        String invoiceNumber;
        do {
            invoiceNumber = "INV-" + year + "-" + shopId + "-" + String.format("%04d", count);
            count++;
        } while (invoiceRepository.existsByInvoiceNumber(invoiceNumber));

        return invoiceNumber;
    }

    private InvoiceResponse mapToResponse(Invoice invoice) {
        List<InvoiceItemResponse> itemResponses = invoice.getItems().stream()
                .map(item -> new InvoiceItemResponse(
                        item.getId(),
                        item.getProductName(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getTotalPrice()
                )).collect(Collectors.toList());

        return new InvoiceResponse(
                invoice.getId(),
                invoice.getInvoiceNumber(),
                invoice.getCustomer().getName(),
                invoice.getCreatedBy().getName(),
                itemResponses,
                invoice.getSubtotal(),
                invoice.getDiscount(),
                invoice.getTaxPercent(),
                invoice.getTotalAmount(),
                invoice.getPaymentMethod(),
                invoice.getPaymentStatus(),
                invoice.getNotes(),
                invoice.getCreatedAt()
        );
    }
}

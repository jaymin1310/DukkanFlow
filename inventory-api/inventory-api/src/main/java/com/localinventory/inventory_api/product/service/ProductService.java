package com.localinventory.inventory_api.product.service;

import com.localinventory.inventory_api.category.entity.Category;
import com.localinventory.inventory_api.category.repository.CategoryRepository;
import com.localinventory.inventory_api.exception.ResourceNotFoundException;
import com.localinventory.inventory_api.product.dto.ProductRequest;
import com.localinventory.inventory_api.product.dto.ProductResponse;
import com.localinventory.inventory_api.product.entity.Product;
import com.localinventory.inventory_api.product.repository.ProductRepository;
import com.localinventory.inventory_api.security.ShopContext;
import com.localinventory.inventory_api.shop.entity.Shop;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ShopContext shopContext;

    public ProductResponse create(ProductRequest request) {
        Shop shop = shopContext.getCurrentShop();
        if (productRepository.existsBySkuAndShopId(request.getSku(), shop.getId())) {
            throw new RuntimeException("SKU already exists: " + request.getSku());
        }
        Category category = categoryRepository.findByIdAndShopId(request.getCategoryId(), shop.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = Product.builder()
                .name(request.getName())
                .sku(request.getSku())
                .category(category)
                .shop(shop)
                .purchasePrice(request.getPurchasePrice())
                .sellingPrice(request.getSellingPrice())
                .stockQuantity(request.getStockQuantity())
                .lowStockThreshold(request.getLowStockThreshold())
                .unit(request.getUnit())
                .active(true)
                .build();

        return mapToResponse(productRepository.save(product));
    }

    public Page<ProductResponse> getAll(int page, int size, String search) {
        Long shopId = shopContext.getCurrentShopId();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return productRepository.searchByShop(shopId, search, pageable)
                .map(this::mapToResponse);
    }

    public ProductResponse getById(Long id) {
        return mapToResponse(findById(id));
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Shop shop = shopContext.getCurrentShop();
        Product product = findById(id);
        Category category = categoryRepository.findByIdAndShopId(request.getCategoryId(), shop.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setCategory(category);
        product.setPurchasePrice(request.getPurchasePrice());
        product.setSellingPrice(request.getSellingPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setLowStockThreshold(request.getLowStockThreshold());
        product.setUnit(request.getUnit());

        return mapToResponse(productRepository.save(product));
    }

    public String delete(Long id) {
        Product product = findById(id);
        product.setActive(false);
        productRepository.save(product);
        return "Product deleted successfully";
    }

    public List<ProductResponse> getLowStockProducts() {
        Long shopId = shopContext.getCurrentShopId();
        return productRepository.findLowStockByShop(shopId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private Product findById(Long id) {
        Long shopId = shopContext.getCurrentShopId();
        return productRepository.findByIdAndShopId(id, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    private ProductResponse mapToResponse(Product product) {
        boolean isLowStock = product.getStockQuantity() <= product.getLowStockThreshold();
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getCategory().getName(),
                product.getPurchasePrice(),
                product.getSellingPrice(),
                product.getStockQuantity(),
                product.getLowStockThreshold(),
                product.getUnit(),
                product.getActive(),
                product.getCreatedAt(),
                isLowStock
        );
    }
}
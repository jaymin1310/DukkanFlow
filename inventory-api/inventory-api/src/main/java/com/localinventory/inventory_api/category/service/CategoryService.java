package com.localinventory.inventory_api.category.service;

import com.localinventory.inventory_api.category.dto.CategoryRequest;
import com.localinventory.inventory_api.category.dto.CategoryResponse;
import com.localinventory.inventory_api.category.entity.Category;
import com.localinventory.inventory_api.category.repository.CategoryRepository;
import com.localinventory.inventory_api.exception.ResourceNotFoundException;
import com.localinventory.inventory_api.security.ShopContext;
import com.localinventory.inventory_api.shop.entity.Shop;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ShopContext shopContext;

    public CategoryResponse create(CategoryRequest request) {
        Shop shop = shopContext.getCurrentShop();
        if (categoryRepository.existsByNameAndShopId(request.getName(), shop.getId())) {
            throw new RuntimeException("Category already exists: " + request.getName());
        }
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .shop(shop)
                .build();
        return mapToResponse(categoryRepository.save(category));
    }

    public List<CategoryResponse> getAll() {
        Long shopId = shopContext.getCurrentShopId();
        return categoryRepository.findAllByShopId(shopId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getById(Long id) {
        return mapToResponse(findById(id));
    }

    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = findById(id);
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        return mapToResponse(categoryRepository.save(category));
    }

    public String delete(Long id) {
        categoryRepository.delete(findById(id));
        return "Category deleted successfully";
    }

    private Category findById(Long id) {
        Long shopId = shopContext.getCurrentShopId();
        return categoryRepository.findByIdAndShopId(id, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    }

    private CategoryResponse mapToResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getCreatedAt()
        );
    }
}
package com.localinventory.inventory_api.customer.service;

import com.localinventory.inventory_api.customer.dto.CustomerRequest;
import com.localinventory.inventory_api.customer.dto.CustomerResponse;
import com.localinventory.inventory_api.customer.entity.Customer;
import com.localinventory.inventory_api.customer.repository.CustomerRepository;
import com.localinventory.inventory_api.exception.ResourceNotFoundException;
import com.localinventory.inventory_api.security.ShopContext;
import com.localinventory.inventory_api.shop.entity.Shop;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final ShopContext shopContext;

    public CustomerResponse create(CustomerRequest request) {
        Shop shop = shopContext.getCurrentShop();
        Customer customer = Customer.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .shop(shop)
                .build();
        return mapToResponse(customerRepository.save(customer));
    }

    public Page<CustomerResponse> getAll(int page, int size, String search) {
        Long shopId = shopContext.getCurrentShopId();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return customerRepository.searchByShop(shopId, search, pageable)
                .map(this::mapToResponse);
    }

    public CustomerResponse getById(Long id) {
        return mapToResponse(findById(id));
    }

    public CustomerResponse update(Long id, CustomerRequest request) {
        Customer customer = findById(id);
        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setAddress(request.getAddress());
        return mapToResponse(customerRepository.save(customer));
    }

    public String delete(Long id) {
        Customer customer = findById(id);
        try {
            customerRepository.delete(customer);
            return "Customer deleted successfully";
        } catch (Exception e) {
            throw new RuntimeException("Cannot delete customer — they have invoices linked. Delete invoices first.");
        }
    }

    private Customer findById(Long id) {
        Long shopId = shopContext.getCurrentShopId();
        return customerRepository.findByIdAndShopId(id, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
    }

    private CustomerResponse mapToResponse(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getName(),
                customer.getPhone(),
                customer.getEmail(),
                customer.getAddress(),
                customer.getTotalPurchases(),
                customer.getCreatedAt()
        );
    }
}
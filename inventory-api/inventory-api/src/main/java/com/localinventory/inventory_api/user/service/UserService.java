package com.localinventory.inventory_api.user.service;

import com.localinventory.inventory_api.exception.ResourceNotFoundException;
import com.localinventory.inventory_api.user.entity.User;
import com.localinventory.inventory_api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }
}
package com.localinventory.inventory_api.auth.service;

import com.localinventory.inventory_api.auth.dto.LoginRequest;
import com.localinventory.inventory_api.auth.dto.LoginResponse;
import com.localinventory.inventory_api.auth.dto.RegisterRequest;
import com.localinventory.inventory_api.exception.ResourceNotFoundException;
import com.localinventory.inventory_api.security.JwtUtil;
import com.localinventory.inventory_api.shop.entity.Shop;
import com.localinventory.inventory_api.shop.repository.ShopRepository;
import com.localinventory.inventory_api.user.entity.User;
import com.localinventory.inventory_api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (shopRepository.existsByMobile(request.getMobile())) {
            throw new RuntimeException("Mobile already registered");
        }

        // Create shop first
        Shop shop = Shop.builder()
                .name(request.getShopName())
                .ownerName(request.getName())
                .mobile(request.getMobile())
                .email(request.getEmail())
                .address(request.getShopAddress())
                .build();
        shopRepository.save(shop);

        // Create user linked to shop
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .shop(shop)
                .active(true)
                .build();
        userRepository.save(user);

        return "Shop and user registered successfully";
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return new LoginResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getShop().getName(),
                user.getShop().getId()
        );
    }
}
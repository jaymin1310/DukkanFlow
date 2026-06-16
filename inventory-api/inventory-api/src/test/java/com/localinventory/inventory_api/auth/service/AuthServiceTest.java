package com.localinventory.inventory_api.auth.service;

import com.localinventory.inventory_api.auth.dto.RegisterRequest;
import com.localinventory.inventory_api.auth.dto.OtpResponse;
import com.localinventory.inventory_api.auth.entity.OtpType;
import com.localinventory.inventory_api.security.JwtUtil;
import com.localinventory.inventory_api.shop.entity.Shop;
import com.localinventory.inventory_api.shop.repository.ShopRepository;
import com.localinventory.inventory_api.user.entity.Role;
import com.localinventory.inventory_api.user.entity.User;
import com.localinventory.inventory_api.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private ShopRepository shopRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtUtil jwtUtil;
    @Mock private UserDetailsService userDetailsService;
    @Mock private OtpService otpService;

    @InjectMocks
    private AuthService authService;

    @Test
    void shouldThrowWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@gmail.com");
        request.setMobile("9876543210");
        request.setRole(Role.OWNER);

        when(userRepository.existsByEmailAndActiveTrue("test@gmail.com")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.register(request));

        assertTrue(ex.getMessage().contains("Email already registered"));
    }

    @Test
    void shouldThrowWhenMobileAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@gmail.com");
        request.setMobile("9876543210");
        request.setRole(Role.OWNER);

        when(userRepository.existsByEmailAndActiveTrue("new@gmail.com")).thenReturn(false);
        when(userRepository.findByEmail("new@gmail.com")).thenReturn(Optional.empty());
        when(userRepository.findByShop_MobileAndActiveTrue("9876543210"))
                .thenReturn(Optional.of(new User()));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.register(request));

        assertTrue(ex.getMessage().contains("Mobile already registered"));
    }

    @Test
    void shouldReuseInactiveRegistrationWhenMobileAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setName("New Owner");
        request.setEmail("new@gmail.com");
        request.setPassword("password");
        request.setMobile("9876543210");
        request.setShopName("New Shop");
        request.setShopAddress("New Address");
        request.setRole(Role.OWNER);

        Shop shop = Shop.builder()
                .id(1L)
                .name("Old Shop")
                .ownerName("Old Owner")
                .email("old@gmail.com")
                .mobile("9876543210")
                .address("Old Address")
                .build();
        User inactiveUser = User.builder()
                .id(1L)
                .name("Old Owner")
                .email("old@gmail.com")
                .password("old-password")
                .role(Role.OWNER)
                .shop(shop)
                .active(false)
                .build();

        when(userRepository.existsByEmailAndActiveTrue("new@gmail.com")).thenReturn(false);
        when(userRepository.findByEmail("new@gmail.com")).thenReturn(Optional.empty());
        when(userRepository.findByShop_Mobile("9876543210")).thenReturn(Optional.of(inactiveUser));
        when(passwordEncoder.encode("password")).thenReturn("encoded-password");
        when(otpService.generateAndSendOtp(inactiveUser, OtpType.EMAIL_VERIFICATION))
                .thenReturn(OtpResponse.builder().success(true).build());

        String response = authService.register(request);

        assertTrue(response.contains("Registration saved"));
        assertEquals("new@gmail.com", inactiveUser.getEmail());
        assertEquals("new@gmail.com", shop.getEmail());
        assertEquals("New Owner", inactiveUser.getName());
        assertEquals("New Shop", shop.getName());
        assertFalse(inactiveUser.getActive());
        verify(shopRepository).save(shop);
        verify(userRepository).save(inactiveUser);
    }
}

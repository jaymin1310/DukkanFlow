package com.localinventory.inventory_api.auth.service;

import com.localinventory.inventory_api.auth.dto.ApiResponse;
import com.localinventory.inventory_api.auth.dto.LoginRequest;
import com.localinventory.inventory_api.auth.dto.LoginResponse;
import com.localinventory.inventory_api.auth.dto.OtpRequest;
import com.localinventory.inventory_api.auth.dto.OtpResponse;
import com.localinventory.inventory_api.auth.dto.RegisterRequest;
import com.localinventory.inventory_api.auth.dto.ResetPasswordRequest;
import com.localinventory.inventory_api.auth.dto.VerifyOtpRequest;
import com.localinventory.inventory_api.auth.entity.OtpType;
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
    private final OtpService otpService;

    public String register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String mobile = request.getMobile().trim();

        if (userRepository.existsByEmailAndActiveTrue(email)) {
            throw new RuntimeException("Email already registered");
        }

        User user = userRepository.findByEmail(email).orElse(null);
        User existingEmailShopUser = userRepository.findByShop_EmailAndActiveTrue(email).orElse(null);
        if (isDifferentUser(existingEmailShopUser, user)) {
            throw new RuntimeException("Email already registered");
        }

        User existingMobileShopUser = userRepository.findByShop_MobileAndActiveTrue(mobile).orElse(null);
        if (isDifferentUser(existingMobileShopUser, user)) {
            throw new RuntimeException("Mobile already registered");
        }

        User mobileUser = userRepository.findByShop_Mobile(mobile).orElse(null);
        if (user == null) {
            user = mobileUser;
        } else if (isDifferentUser(mobileUser, user)) {
            throw new RuntimeException("Mobile already registered");
        }

        if (user == null) {
            Shop shop = Shop.builder()
                    .name(request.getShopName())
                    .ownerName(request.getName())
                    .mobile(mobile)
                    .email(email)
                    .address(request.getShopAddress())
                    .build();
            shopRepository.save(shop);

            user = User.builder()
                    .name(request.getName())
                    .email(email)
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(request.getRole())
                    .shop(shop)
                    .active(false)
                    .build();
        } else {
            Shop shop = user.getShop();
            shop.setName(request.getShopName());
            shop.setOwnerName(request.getName());
            shop.setMobile(mobile);
            shop.setEmail(email);
            shop.setAddress(request.getShopAddress());
            shopRepository.save(shop);

            user.setName(request.getName());
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole());
            user.setActive(false);
        }

        userRepository.save(user);
        OtpResponse otpResponse = otpService.generateAndSendOtp(user, OtpType.EMAIL_VERIFICATION);

        return otpResponse.isSuccess()
                ? "Registration saved. OTP has been sent to your email for verification."
                : otpResponse.getMessage();
    }

    private boolean isDifferentUser(User foundUser, User currentUser) {
        if (foundUser == null) {
            return false;
        }

        if (currentUser == null) {
            return true;
        }

        return foundUser.getId() == null || currentUser.getId() == null
                ? foundUser != currentUser
                : !foundUser.getId().equals(currentUser.getId());
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

    public ApiResponse forgotPassword(OtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            return ApiResponse.builder()
                    .success(false)
                    .message("No account found with this email address")
                    .build();
        }

        if (Boolean.FALSE.equals(user.getActive())) {
            return ApiResponse.builder()
                    .success(false)
                    .message("This account is inactive. Please contact support.")
                    .build();
        }

        OtpResponse otpResponse = otpService.generateAndSendOtp(user, OtpType.PASSWORD_RESET);
        return ApiResponse.builder()
                .success(otpResponse.isSuccess())
                .message(otpResponse.isSuccess()
                        ? "Email found. OTP has been sent to your registered email address."
                        : otpResponse.getMessage())
                .build();
    }

    public ApiResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or OTP"));

        if (Boolean.FALSE.equals(user.getActive())) {
            throw new RuntimeException("Invalid email or OTP");
        }

        otpService.validateOtp(user, request.getOtp(), OtpType.PASSWORD_RESET);
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ApiResponse.builder()
                .success(true)
                .message("Password reset successfully")
                .build();
    }

    public ApiResponse verifyRegistrationOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or OTP"));

        if (Boolean.TRUE.equals(user.getActive())) {
            return ApiResponse.builder()
                    .success(true)
                    .message("Email is already verified. Please login.")
                    .build();
        }

        otpService.validateOtp(user, request.getOtp(), OtpType.EMAIL_VERIFICATION);
        user.setActive(true);
        userRepository.save(user);

        return ApiResponse.builder()
                .success(true)
                .message("Email verified successfully. You can login now.")
                .build();
    }
}

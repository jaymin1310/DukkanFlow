package com.localinventory.inventory_api.auth.service;

import com.localinventory.inventory_api.auth.dto.OtpResponse;
import com.localinventory.inventory_api.auth.entity.Otp;
import com.localinventory.inventory_api.auth.entity.OtpType;
import com.localinventory.inventory_api.auth.repository.OtpRepository;
import com.localinventory.inventory_api.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private final SecureRandom random = new SecureRandom();

    public OtpResponse generateAndSendOtp(User user, OtpType otpType) {
        Otp latestOtp = otpRepository
                .findTopByUserAndTypeAndUsedFalseOrderByCreatedAtDesc(user, otpType)
                .orElse(null);

        if (latestOtp != null) {
            LocalDateTime allowedTime = latestOtp.getCreatedAt().plusSeconds(60);
            if (allowedTime.isAfter(LocalDateTime.now())) {
                long secondsLeft = Duration.between(LocalDateTime.now(), allowedTime).getSeconds();
                return OtpResponse.builder()
                        .success(false)
                        .message("Please wait " + secondsLeft + " seconds before requesting new OTP")
                        .build();
            }

            otpRepository.invalidateAllOtpByUserAndType(user, otpType);
        }

        String code = String.valueOf(100000 + random.nextInt(900000));
        Otp otp = Otp.builder()
                .code(code)
                .user(user)
                .createdAt(LocalDateTime.now())
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .used(false)
                .type(otpType)
                .build();

        otpRepository.save(otp);
        emailService.sendOtpEmail(user.getEmail(), code, otpType);

        return OtpResponse.builder()
                .success(true)
                .message("OTP sent successfully")
                .build();
    }

    public void validateOtp(User user, String otpCode, OtpType otpType) {
        Otp otp = otpRepository.findByCodeAndUserAndType(otpCode, user, otpType)
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        if (otp.isUsed()) {
            throw new RuntimeException("OTP already used");
        }

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        otp.setUsed(true);
        otpRepository.save(otp);
    }
}

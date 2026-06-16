package com.localinventory.inventory_api.auth.service;

import com.localinventory.inventory_api.auth.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class OtpCleanupJob {

    private final OtpRepository otpRepository;

    @Scheduled(fixedRate = 3_600_000)
    @Transactional
    public void cleanupExpiredOtp() {
        otpRepository.deleteByExpiryTimeBefore(LocalDateTime.now());
        otpRepository.deleteByUsedTrue();
    }
}

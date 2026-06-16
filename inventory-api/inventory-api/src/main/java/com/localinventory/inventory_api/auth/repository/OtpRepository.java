package com.localinventory.inventory_api.auth.repository;

import com.localinventory.inventory_api.auth.entity.Otp;
import com.localinventory.inventory_api.auth.entity.OtpType;
import com.localinventory.inventory_api.user.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByCodeAndUserAndType(String code, User user, OtpType type);

    Optional<Otp> findTopByUserAndTypeAndUsedFalseOrderByCreatedAtDesc(User user, OtpType type);

    void deleteByExpiryTimeBefore(LocalDateTime now);

    void deleteByUsedTrue();

    @Modifying
    @Transactional
    @Query("""
            UPDATE Otp o
            SET o.used = true
            WHERE o.user = :user
            AND o.type = :type
            AND o.used = false
            """)
    void invalidateAllOtpByUserAndType(User user, OtpType type);
}

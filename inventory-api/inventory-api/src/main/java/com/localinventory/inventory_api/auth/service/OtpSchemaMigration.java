package com.localinventory.inventory_api.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OtpSchemaMigration implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        jdbcTemplate.execute("ALTER TABLE otps DROP CONSTRAINT IF EXISTS otps_type_check");
        jdbcTemplate.execute("""
                ALTER TABLE otps
                ADD CONSTRAINT otps_type_check
                CHECK (type IN ('PASSWORD_RESET', 'EMAIL_VERIFICATION'))
                """);
    }
}

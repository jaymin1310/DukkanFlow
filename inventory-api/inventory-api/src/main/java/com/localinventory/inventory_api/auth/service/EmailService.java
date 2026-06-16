package com.localinventory.inventory_api.auth.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import com.localinventory.inventory_api.auth.entity.OtpType;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String email, String otp) {
        sendOtpEmail(email, otp, OtpType.PASSWORD_RESET);
    }

    public void sendOtpEmail(String email, String otp, OtpType otpType) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject(subjectFor(otpType));

            String htmlContent = loadTemplate("otp-email.html")
                    .replace("{{OTP}}", otp)
                    .replace("{{PURPOSE}}", purposeFor(otpType))
                    .replace("{{IGNORE_MESSAGE}}", ignoreMessageFor(otpType));
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email");
        }
    }

    private String subjectFor(OtpType otpType) {
        return otpType == OtpType.EMAIL_VERIFICATION
                ? "Verify your DukaanFlow email"
                : "Your DukaanFlow password reset OTP";
    }

    private String purposeFor(OtpType otpType) {
        return otpType == OtpType.EMAIL_VERIFICATION
                ? "Use this OTP to verify your email and activate your DukaanFlow account."
                : "Use this OTP to reset your password.";
    }

    private String ignoreMessageFor(OtpType otpType) {
        return otpType == OtpType.EMAIL_VERIFICATION
                ? "If you did not create a DukaanFlow account, you can ignore this email."
                : "If you did not request a password reset, you can ignore this email.";
    }

    private String loadTemplate(String fileName) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/" + fileName);
            return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load email template");
        }
    }
}

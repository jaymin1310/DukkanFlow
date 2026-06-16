package com.localinventory.inventory_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiError(404, ex.getMessage(), LocalDateTime.now()));
    }

    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<ApiError> handleStock(InsufficientStockException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiError(400, ex.getMessage(), LocalDateTime.now()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiError(400, msg, LocalDateTime.now()));
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrity(Exception ex) {
        String details = getRootCauseMessage(ex).toLowerCase();
        String message = "This record conflicts with existing data.";

        if ((details.contains("users") && details.contains("email"))
                || (details.contains("shops") && details.contains("email"))
                || details.contains("uk_6dotkott2kjsp8vw4d0m25fb7")
                || details.contains("uk_3ciw6e8uttpdhvm56p44sx7xf")) {
            message = "Email already registered";
        } else if ((details.contains("shops") && details.contains("mobile"))
                || details.contains("uk_28kgt9cauixmjr58x4bq791tc")) {
            message = "Mobile already registered";
        } else if (details.contains("foreign key") || details.contains("violates foreign key constraint")) {
            message = "Cannot delete - this record has linked invoices. Delete invoices first.";
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiError(400, message, LocalDateTime.now()));
    }

    private String getRootCauseMessage(Throwable ex) {
        Throwable root = ex;
        while (root.getCause() != null) {
            root = root.getCause();
        }
        return root.getMessage() == null ? "" : root.getMessage();
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiError> handleRuntime(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiError(400, ex.getMessage(), LocalDateTime.now()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleAll(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiError(500, "Something went wrong: " + ex.getMessage(), LocalDateTime.now()));
    }
}

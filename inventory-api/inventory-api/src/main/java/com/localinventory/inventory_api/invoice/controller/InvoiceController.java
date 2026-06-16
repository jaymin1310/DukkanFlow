package com.localinventory.inventory_api.invoice.controller;

import com.localinventory.inventory_api.invoice.dto.InvoiceRequest;
import com.localinventory.inventory_api.invoice.dto.InvoiceResponse;
import com.localinventory.inventory_api.invoice.service.InvoiceService;
import com.localinventory.inventory_api.invoice.service.PdfService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final PdfService pdfService;

    @PostMapping
    public ResponseEntity<InvoiceResponse> create(@Valid @RequestBody InvoiceRequest request) {
        return ResponseEntity.ok(invoiceService.createInvoice(request));
    }

    @GetMapping
    public ResponseEntity<Page<InvoiceResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(invoiceService.getAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getById(id));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) throws IOException {
        InvoiceResponse invoice = invoiceService.getById(id);
        byte[] pdf = pdfService.generateInvoicePdf(invoice);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=invoice-" + id + ".pdf")
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<InvoiceResponse>> getByDateRange(@RequestParam String period) {
        return ResponseEntity.ok(invoiceService.getByDateRange(period));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.deleteInvoice(id));
    }
}
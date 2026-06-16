package com.localinventory.inventory_api.invoice.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.localinventory.inventory_api.invoice.dto.InvoiceResponse;
import com.localinventory.inventory_api.security.ShopContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class PdfService {

    private final ShopContext shopContext;

    public byte[] generateInvoicePdf(InvoiceResponse invoice) throws IOException {
        String shopName = shopContext.getCurrentShop().getName().toUpperCase();
        String shopAddress = shopContext.getCurrentShop().getAddress();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document doc = new Document(pdf, PageSize.A4);
        doc.setMargins(40, 40, 40, 40);

        // Header
        doc.add(new Paragraph(shopName)
                .setFontSize(22)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(new DeviceRgb(30, 58, 95)));

        if (shopAddress != null && !shopAddress.isEmpty()) {
            doc.add(new Paragraph(shopAddress)
                    .setFontSize(11)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(ColorConstants.GRAY));
        }

        doc.add(new Paragraph("TAX INVOICE")
                .setFontSize(13)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.GRAY));

        doc.add(new Paragraph(" "));

        // Invoice details
        doc.add(new Paragraph("Invoice No: " + invoice.getInvoiceNumber()).setFontSize(11).setBold());
        doc.add(new Paragraph("Date: " + invoice.getCreatedAt().toLocalDate()).setFontSize(11));
        doc.add(new Paragraph("Customer: " + invoice.getCustomerName()).setFontSize(11));
        doc.add(new Paragraph("Created By: " + invoice.getCreatedBy()).setFontSize(11));
        doc.add(new Paragraph("Payment: " + invoice.getPaymentMethod()).setFontSize(11));

        doc.add(new Paragraph(" "));

        // Items table
        Table table = new Table(new float[]{4, 1, 2, 2});
        table.setWidth(UnitValue.createPercentValue(100));

        table.addHeaderCell(new Cell().add(new Paragraph("Product").setBold()).setBackgroundColor(new DeviceRgb(200, 220, 255)));
        table.addHeaderCell(new Cell().add(new Paragraph("Qty").setBold()).setBackgroundColor(new DeviceRgb(200, 220, 255)));
        table.addHeaderCell(new Cell().add(new Paragraph("Unit Price").setBold()).setBackgroundColor(new DeviceRgb(200, 220, 255)));
        table.addHeaderCell(new Cell().add(new Paragraph("Total").setBold()).setBackgroundColor(new DeviceRgb(200, 220, 255)));

        for (var item : invoice.getItems()) {
            table.addCell(new Cell().add(new Paragraph(item.getProductName())));
            table.addCell(new Cell().add(new Paragraph(String.valueOf(item.getQuantity()))));
            table.addCell(new Cell().add(new Paragraph("Rs. " + item.getUnitPrice())));
            table.addCell(new Cell().add(new Paragraph("Rs. " + item.getTotalPrice())));
        }

        doc.add(table);
        doc.add(new Paragraph(" "));

        // Totals
        doc.add(new Paragraph("Subtotal:  Rs. " + invoice.getSubtotal())
                .setTextAlignment(TextAlignment.RIGHT).setFontSize(11));
        doc.add(new Paragraph("Discount:  " + invoice.getDiscount() + "%")
                .setTextAlignment(TextAlignment.RIGHT).setFontSize(11));
        doc.add(new Paragraph("Tax:  " + invoice.getTaxPercent() + "%")
                .setTextAlignment(TextAlignment.RIGHT).setFontSize(11));
        doc.add(new Paragraph("TOTAL:  Rs. " + invoice.getTotalAmount())
                .setTextAlignment(TextAlignment.RIGHT)
                .setFontSize(14).setBold()
                .setFontColor(new DeviceRgb(30, 58, 95)));

        if (invoice.getNotes() != null && !invoice.getNotes().isEmpty()) {
            doc.add(new Paragraph(" "));
            doc.add(new Paragraph("Notes: " + invoice.getNotes())
                    .setFontSize(10).setFontColor(ColorConstants.GRAY));
        }

        doc.add(new Paragraph(" "));
        doc.add(new Paragraph("Thank you for your business!")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(11).setFontColor(ColorConstants.GRAY));

        doc.close();
        return out.toByteArray();
    }
}
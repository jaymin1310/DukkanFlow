package com.localinventory.inventory_api.dashboard.controller;

import com.localinventory.inventory_api.dashboard.dto.ProfitLossResponse;
import com.localinventory.inventory_api.dashboard.service.ProfitLossService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profit-loss")
@RequiredArgsConstructor
public class ProfitLossController {

    private final ProfitLossService profitLossService;

    @GetMapping
    public ResponseEntity<ProfitLossResponse> getProfitLoss() {
        return ResponseEntity.ok(profitLossService.getProfitLoss());
    }
}
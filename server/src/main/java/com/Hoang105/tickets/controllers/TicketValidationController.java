package com.Hoang105.tickets.controllers;

import com.Hoang105.tickets.domain.dtos.Staff.TicketValidationRequestDto;
import com.Hoang105.tickets.domain.dtos.Staff.TicketValidationResponseDto;
import com.Hoang105.tickets.domain.entities.TicketValidation;
import com.Hoang105.tickets.domain.entities.enums.TicketValidationMethodEnum;
import com.Hoang105.tickets.mappers.TicketValidationMapper;
import com.Hoang105.tickets.services.TicketValidationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Ticket Validations", description = "Operations related to ticket validation, accessible by authenticated staff")
@RequestMapping(path = "/api/v1/ticket-validations")
@RequiredArgsConstructor
public class TicketValidationController {
    private final TicketValidationService ticketValidationService;
    private final TicketValidationMapper ticketValidationMapper;

    @PostMapping
    @Operation (summary = "Validate a ticket", description = "Validate a ticket either manually or by scanning a QR code by authenticated staff")
    public ResponseEntity<TicketValidationResponseDto> validateticket(
            @RequestBody TicketValidationRequestDto ticketValidationRequestDto
    ) {
        TicketValidationMethodEnum method = ticketValidationRequestDto.getMethod();

        TicketValidation ticketValidation;

        if (TicketValidationMethodEnum.MANUAL.equals(method)) {
            ticketValidation = ticketValidationService.validateTicketManually(ticketValidationRequestDto.getId());
        } else {
            ticketValidation = ticketValidationService.validateTicketByQrCode(ticketValidationRequestDto.getId());
        }

        return ResponseEntity.ok(ticketValidationMapper.toTicketValidationResponseDto(ticketValidation));
    }

}


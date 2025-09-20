package com.Hoang105.tickets.controllers;

import java.util.UUID;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Hoang105.tickets.services.TicketTypeService;
import com.Hoang105.tickets.utils.JwtUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Tag(name = "Ticket Types", description = "Operations related to ticket types, accessible by authenticated attendees")
@RequestMapping(path = "/api/v1/events/{eventId}/ticket-types")
public class TicketTypeController {
    private final TicketTypeService ticketTypeService;

    @PostMapping(path = "/{ticketTypeId}/tickets")
    @Operation(summary = "Purchase a ticket", description = "Purchase a ticket of a specific ticket type for the authenticated attendee")
    public ResponseEntity<Void> purchaseTicket(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable UUID ticketTypeId
    ){
        UUID userId = JwtUtil.parseUserId(jwt);

        ticketTypeService.purchaseTicket(userId, ticketTypeId);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

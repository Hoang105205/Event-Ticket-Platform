package com.Hoang105.tickets.controllers;

import java.util.Optional;
import java.util.UUID;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.Hoang105.tickets.domain.dtos.Attendee.GetTicketResponseDto;
import com.Hoang105.tickets.domain.dtos.Attendee.ListTicketResponseDto;
import com.Hoang105.tickets.domain.entities.Ticket;
import com.Hoang105.tickets.mappers.TicketMapper;
import com.Hoang105.tickets.services.QrCodeService;
import com.Hoang105.tickets.services.TicketService;
import com.Hoang105.tickets.utils.JwtUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/tickets")
@Tag(name = "Tickets", description = "Operations related to tickets, accessible by authenticated attendees")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final TicketMapper ticketMapper;
    private final QrCodeService qrCodeService;

    @GetMapping
    @Operation(summary = "List tickets for authenticated attendee", description = "Retrieve a paginated list of tickets associated with the authenticated attendee")
    public ResponseEntity<Page<ListTicketResponseDto>> listTickets(
        @AuthenticationPrincipal Jwt jwt,
        Pageable pageable
    ){

        UUID userId = JwtUtil.parseUserId(jwt);

        Page<Ticket> tickets = ticketService.listTicketForUser(userId, pageable);

        return ResponseEntity.ok(
            tickets.map(ticketMapper::toListTicketResponseDto)
        );

    }

    @GetMapping(path = "/{ticketId}")
    @Operation(summary = "Get ticket details", description = "Retrieve detailed information about a specific ticket by its ID for the authenticated attendee")
    public ResponseEntity<GetTicketResponseDto> getTicket(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable UUID ticketId){

        UUID userId = JwtUtil.parseUserId(jwt);

        return ticketService.getTicketForUser(userId, ticketId)
                                .map(ticketMapper::toGetTicketResponseDto)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
         
    }

    @GetMapping(path = "/{ticketId}/qr-codes")
    @Operation(summary = "Get ticket QR code", description = "Retrieve the QR code image for a specific ticket by its ID for the authenticated attendee")
    public ResponseEntity<byte[]> getTicketQrCode (
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable UUID ticketId){

        UUID userId = JwtUtil.parseUserId(jwt);

        byte[] qrCodeImage = qrCodeService.getQrCodeImageForUserAndTicket(userId, ticketId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentLength(qrCodeImage.length);

        return ResponseEntity.ok()
                            .headers(headers)
                            .body(qrCodeImage);

    }

    @PutMapping(path = "/{ticketId}/cancel-ticket")
    @Operation(summary = "Cancel a ticket", description = "Cancel a specific ticket by its ID for the authenticated attendee")
    public ResponseEntity<Void> cancelTicket(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable UUID ticketId){

        UUID userId = JwtUtil.parseUserId(jwt);

        Optional<Ticket> canceledTicket = ticketService.cancelTicket(userId, ticketId);

        if (canceledTicket.isPresent()){
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }

    }

}

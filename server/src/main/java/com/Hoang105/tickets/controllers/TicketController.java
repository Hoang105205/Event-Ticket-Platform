package com.Hoang105.tickets.controllers;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final TicketMapper ticketMapper;
    private final QrCodeService qrCodeService;

    @GetMapping
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

}

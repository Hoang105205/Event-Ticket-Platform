package com.Hoang105.tickets.controllers;

import com.Hoang105.tickets.domain.dtos.Administrator.PlatformStatisticsResponseDto;
import com.Hoang105.tickets.domain.entities.enums.EventStatusEnum;
import com.Hoang105.tickets.services.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "Administrator", description = "Operations related to administrator, accessible by administrators only")
@RequestMapping("/api/v1/admin")
public class AdministratorController {

    private final UserService userService;
    private final EventService eventService;
    private final TicketService ticketService;

    @GetMapping
    @Operation(summary = "Get platform statistics", description = "Retrieve various statistics about the platform")
    public ResponseEntity<PlatformStatisticsResponseDto> getPlatformStatistics(
            @AuthenticationPrincipal Jwt jwt){

        int totalAttendees = userService.countTotalAttendees();
        int totalEvents = eventService.countTotalEvents();
        int publishedEvents = eventService.countEventsByStatus(EventStatusEnum.PUBLISHED);
        int draftEvents = eventService.countEventsByStatus(EventStatusEnum.DRAFT);
        int totalTicketsSold = ticketService.countTotalTicketsSold();
        int totalTicketsRemaining = ticketService.countTotalTicketsRemaining();
        int newAttendeesThisWeek = userService.countNewAttendeesThisWeek();
        int newAttendeesThisMonth = userService.countNewAttendeesThisMonth();

        PlatformStatisticsResponseDto responseDto = new PlatformStatisticsResponseDto(
                totalAttendees,
                totalEvents,
                publishedEvents,
                draftEvents,
                totalTicketsSold,
                totalTicketsRemaining,
                newAttendeesThisWeek,
                newAttendeesThisMonth
        );

        return ResponseEntity.ok(responseDto);
    };
}

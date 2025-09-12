package com.Hoang105.tickets.controllers;

import com.Hoang105.tickets.domain.dtos.Administrator.PlatformStatisticsResponseDto;
import com.Hoang105.tickets.domain.entities.enums.EventStatusEnum;
import com.Hoang105.tickets.services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdministratorController {

    private final UserService userService;
    private final EventService eventService;
    private final TicketService ticketService;

    @GetMapping
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

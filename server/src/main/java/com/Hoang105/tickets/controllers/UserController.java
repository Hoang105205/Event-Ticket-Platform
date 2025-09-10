package com.Hoang105.tickets.controllers;

import com.Hoang105.tickets.domain.dtos.Administrator.GetAttendeeDetailsResponseDto;
import com.Hoang105.tickets.domain.dtos.Administrator.ListAttendeeTicketResponseDto;
import com.Hoang105.tickets.domain.dtos.Administrator.ListAttendeesResponseDto;
import com.Hoang105.tickets.domain.entities.Ticket;
import com.Hoang105.tickets.domain.entities.User;
import com.Hoang105.tickets.mappers.TicketMapper;
import com.Hoang105.tickets.mappers.UserMapper;
import com.Hoang105.tickets.services.TicketService;
import com.Hoang105.tickets.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final TicketService ticketService;
    private final TicketMapper ticketMapper;

    @GetMapping(path = "/attendees")
    public ResponseEntity<Page<ListAttendeesResponseDto>> listAttendees(
            @AuthenticationPrincipal Jwt jwt,
            Pageable pageable) {

        Page<User> users = userService.listAttendees(pageable);

        List<ListAttendeesResponseDto> responseDtos = users.getContent().stream()
                .map(user -> {
                    Integer totalTickets = userService.countTotalTickets(user.getId());
                    LocalDateTime lastPurchaseDate = userService.lastPurchaseDate(user.getId());
                    return userMapper.toListAttendeesResponseDto(user, totalTickets, lastPurchaseDate);
                })
                .collect(Collectors.toList());

        Page<ListAttendeesResponseDto> page = new PageImpl<>(responseDtos, pageable, users.getTotalElements());

        return ResponseEntity.ok(page);
    }

    @GetMapping(path = "/attendees/{attendeeId}")
    public ResponseEntity<GetAttendeeDetailsResponseDto> getAttendeeDetails(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID attendeeId) {

        User user = userService.getUserById(attendeeId);
        Integer totalTickets = userService.countTotalTickets(user.getId());
        LocalDateTime lastPurchaseDate = userService.lastPurchaseDate(user.getId());

        GetAttendeeDetailsResponseDto responseDto = userMapper.toGetAttendeeDetailsResponseDto(user, totalTickets, lastPurchaseDate);

        return ResponseEntity.ok(responseDto);
    }

    @GetMapping(path = "/attendees/{attendeeId}/tickets")
    public ResponseEntity<Page<ListAttendeeTicketResponseDto>> listTicketsForAttendee(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID attendeeId,
            Pageable pageable) {

        Page<Ticket> tickets = ticketService.listTicketForUser(attendeeId, pageable);

        List<ListAttendeeTicketResponseDto> responseDtos = tickets.getContent().stream()
                .map(ticketMapper::toListAttendeeTicketDto)
                .collect(Collectors.toList());

        Page<ListAttendeeTicketResponseDto> page = new PageImpl<>(responseDtos, pageable, tickets.getTotalElements());

        return ResponseEntity.ok(page);
    }
}

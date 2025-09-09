package com.Hoang105.tickets.controllers;

import com.Hoang105.tickets.domain.dtos.ListAttendeesResponseDto;
import com.Hoang105.tickets.domain.entities.User;
import com.Hoang105.tickets.mappers.UserMapper;
import com.Hoang105.tickets.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

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

}

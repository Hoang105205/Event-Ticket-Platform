package com.Hoang105.tickets.controllers;

import java.util.UUID;

import com.Hoang105.tickets.domain.dtos.Organizer.CreateEventRequestDto;
import com.Hoang105.tickets.domain.dtos.Organizer.CreateEventResponseDto;
import com.Hoang105.tickets.domain.dtos.Organizer.UpdateEventRequestDto;
import com.Hoang105.tickets.domain.dtos.Organizer.UpdateEventResponseDto;
import com.Hoang105.tickets.domain.dtos.Organizer.GetEventDetailsResponseDto;
import com.Hoang105.tickets.domain.dtos.Organizer.ListEventResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.Hoang105.tickets.domain.*;
import com.Hoang105.tickets.mappers.*;
import com.Hoang105.tickets.services.*;
import com.Hoang105.tickets.utils.JwtUtil;
import com.Hoang105.tickets.domain.entities.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@Tag(name = "Event", description = "Operations related to events, accessible by authenticated organizers")
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {
    private final EventMapper eventMapper;
    private final EventService eventService;

    @PostMapping
    @Operation(summary = "Create a new event", description = "Create a new event associated with the authenticated organizer")
    public ResponseEntity<CreateEventResponseDto> createEvent(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateEventRequestDto createEventRequestDto){
        CreateEventRequest createEventRequest = eventMapper.fromDto(createEventRequestDto);
        
        UUID userId = JwtUtil.parseUserId(jwt);

        Event createdEvent = eventService.createEvent(userId, createEventRequest);

        CreateEventResponseDto createEventResponseDto = eventMapper.toDto(createdEvent);

        return new ResponseEntity<>(createEventResponseDto, HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing event", description = "Update details of an existing event associated with the authenticated organizer")
    @PutMapping(path = "/{eventId}")
    public ResponseEntity<UpdateEventResponseDto> updateEvent(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID eventId,
            @Valid @RequestBody UpdateEventRequestDto updateEventRequestDto){
        UpdateEventRequest updateEventRequest = eventMapper.fromDto(updateEventRequestDto);

        UUID userId = JwtUtil.parseUserId(jwt);

        Event updatedEvent = eventService.updateEventForOrganizer(userId, eventId, updateEventRequest);

        UpdateEventResponseDto updateEventResponseDto = eventMapper.toUpdateEventResponseDto(updatedEvent);

        return new ResponseEntity<>(updateEventResponseDto, HttpStatus.OK);
    }

    @Operation(summary = "List events created by the authenticated organizer", description = "Retrieve a paginated list of events created by the authenticated organizer")
    @GetMapping
    public ResponseEntity<Page<ListEventResponseDto>> listEvents(
        @AuthenticationPrincipal Jwt jwt, Pageable pageable){
         
        UUID userId = JwtUtil.parseUserId(jwt);
        
        Page<Event> events = eventService.listEventForOrganizer(userId, pageable);

        return ResponseEntity.ok(
            events.map(eventMapper::toListEventResponseDto)
        );
    }

    @Operation(summary = "Get event details created by the authenticated organizer", description = "Retrieve detailed information about a specific event created by the authenticated organizer")
    @GetMapping(path = "/{eventId}")
    public ResponseEntity<GetEventDetailsResponseDto> getEvent(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable UUID eventId
    ){
        UUID userId = JwtUtil.parseUserId(jwt);

        return eventService.getEventForOrganizer(userId, eventId)
            .map(eventMapper::toGetEventDetailsResponseDto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete an event created by the authenticated organizer", description = "Delete a specific event created by the authenticated organizer")
    @DeleteMapping(path = "/{eventId}")
    public ResponseEntity<Void> deleteEvent(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable UUID eventId){

        UUID userId = JwtUtil.parseUserId(jwt);

        eventService.deleteEventForOrganizer(userId, eventId);

        return ResponseEntity.noContent().build();
    }
}

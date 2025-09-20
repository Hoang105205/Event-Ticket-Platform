package com.Hoang105.tickets.controllers;

import java.util.UUID;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Hoang105.tickets.domain.dtos.*;
import com.Hoang105.tickets.domain.entities.*;
import com.Hoang105.tickets.mappers.EventMapper;
import com.Hoang105.tickets.services.EventService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/api/v1/published-events")
@Tag(name = "Published Events", description = "Operations related to published events")
@RequiredArgsConstructor
public class PublishedEventController {

    private final EventService eventService;
    private final EventMapper eventMapper;

    @GetMapping
    @Operation(summary = "List published events", description = "Retrieve a paginated list of published events with optional search query")
    public ResponseEntity<Page<ListPublishedEventResponseDto>> listPublishedEvents(
        @RequestParam(required = false) String q,
        Pageable pageable) {

        Page<Event> events;

        if (null != q && !q.trim().isEmpty()){
            events = eventService.searchPublishedEvents(q, pageable);
        } else {
            events = eventService.listPublishedEvents(pageable);
        }

        return ResponseEntity.ok(
            events.map(eventMapper::toListPublishedEventResponseDto)
        );
    }

    @GetMapping(path = "/{eventId}")
    @Operation(summary = "Get published event details", description = "Retrieve detailed information about a specific published event by its ID")
    public ResponseEntity<GetPublishedEventDetailsResponseDto> getPublishedEventDetails(
        @PathVariable UUID eventId) {

        return eventService.getPublishedEvent(eventId)
                        .map(eventMapper::toGetPublishedEventDetailsResponseDto)
                        .map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());

    }

}

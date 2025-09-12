package com.Hoang105.tickets.services;

import java.util.Optional;
import java.util.UUID;

import com.Hoang105.tickets.domain.entities.enums.EventStatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.Hoang105.tickets.domain.CreateEventRequest;
import com.Hoang105.tickets.domain.UpdateEventRequest;
import com.Hoang105.tickets.domain.entities.Event;


public interface EventService {
    Event createEvent(UUID organizerId, CreateEventRequest event);

    Page<Event> listEventForOrganizer(UUID organizerId, Pageable pageable);

    Optional<Event> getEventForOrganizer(UUID organizerId, UUID id);

    Event updateEventForOrganizer(UUID organizerId, UUID id, UpdateEventRequest event);

    void deleteEventForOrganizer(UUID organizerId, UUID id);

    Page<Event> listPublishedEvents(Pageable pageable);

    Page<Event> searchPublishedEvents(String query, Pageable pageable);

    Optional<Event> getPublishedEvent(UUID id);

    int countTotalEvents();

    int countEventsByStatus(EventStatusEnum status);

}

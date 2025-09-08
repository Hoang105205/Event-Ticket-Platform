package com.Hoang105.tickets.services;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.Hoang105.tickets.domain.entities.Ticket;

public interface TicketService {
    Page<Ticket> listTicketForUser(UUID userId, Pageable pageable);

    Optional<Ticket> getTicketForUser(UUID userId, UUID ticketId);
    
} 

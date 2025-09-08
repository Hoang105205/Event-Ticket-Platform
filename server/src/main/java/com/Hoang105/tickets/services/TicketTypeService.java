package com.Hoang105.tickets.services;

import java.util.UUID;

import com.Hoang105.tickets.domain.entities.Ticket;

public interface TicketTypeService {
    Ticket purchaseTicket(UUID userId, UUID ticketTypeId);
} 
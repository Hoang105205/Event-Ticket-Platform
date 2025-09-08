package com.Hoang105.tickets.services.impl;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.Hoang105.tickets.domain.entities.Ticket;
import com.Hoang105.tickets.repositories.TicketRepository;
import com.Hoang105.tickets.services.TicketService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;

    @Override
    public Page<Ticket> listTicketForUser(UUID userId, Pageable pageable){
        return ticketRepository.findByPurchaserId(userId, pageable);
    }

    @Override
    public Optional<Ticket> getTicketForUser(UUID userId, UUID ticketId){
        return ticketRepository.findByIdAndPurchaserId(ticketId, userId);
    }
}

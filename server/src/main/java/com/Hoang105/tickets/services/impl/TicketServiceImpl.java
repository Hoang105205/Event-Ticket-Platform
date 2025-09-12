package com.Hoang105.tickets.services.impl;

import java.util.Optional;
import java.util.UUID;

import com.Hoang105.tickets.domain.entities.enums.TicketStatusEnum;
import com.Hoang105.tickets.repositories.TicketTypeRepository;
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
    private final TicketTypeRepository ticketTypeRepository;

    @Override
    public Page<Ticket> listTicketForUser(UUID userId, Pageable pageable){
        return ticketRepository.findByPurchaserId(userId, pageable);
    }

    @Override
    public Optional<Ticket> getTicketForUser(UUID userId, UUID ticketId){
        return ticketRepository.findByIdAndPurchaserId(ticketId, userId);
    }

    @Override
    public Optional<Ticket> cancelTicket(UUID userId, UUID ticketId){
        Optional<Ticket> ticketOpt = ticketRepository.findByIdAndPurchaserId(ticketId, userId);
        ticketOpt.ifPresent(ticket -> {
            ticket.setStatus(TicketStatusEnum.CANCELLED);
            ticketRepository.save(ticket);
        });
        return ticketOpt;
    }

    @Override
    public int countTotalTicketsSold(){
        return ticketRepository.countByStatus(TicketStatusEnum.PURCHASED);
    }

    @Override
    public int countTotalTicketsRemaining(){
        int totalAvailable = ticketTypeRepository.sumTotalAvailable();
        int totalSold = ticketRepository.countByStatus(TicketStatusEnum.PURCHASED);
        return totalAvailable - totalSold;
    }
}

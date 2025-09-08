package com.Hoang105.tickets.services.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.Hoang105.tickets.domain.entities.Ticket;
import com.Hoang105.tickets.domain.entities.TicketStatusEnum;
import com.Hoang105.tickets.domain.entities.TicketType;
import com.Hoang105.tickets.domain.entities.User;
import com.Hoang105.tickets.exceptions.TicketTypetNotFoundException;
import com.Hoang105.tickets.exceptions.TicketsSoldOutException;
import com.Hoang105.tickets.exceptions.UserNotFoundException;
import com.Hoang105.tickets.repositories.TicketRepository;
import com.Hoang105.tickets.repositories.TicketTypeRepository;
import com.Hoang105.tickets.repositories.UserRepository;
import com.Hoang105.tickets.services.QrCodeService;
import com.Hoang105.tickets.services.TicketTypeService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class TicketTypeServiceImpl implements TicketTypeService {

    private final UserRepository userRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final TicketRepository ticketRepository;

    private final QrCodeService qrCodeService;


    @Override
    @Transactional
    public Ticket purchaseTicket(UUID userId, UUID ticketTypeId){
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(
            String.format("User with ID %s not found", userId)
        ));

        TicketType ticketType =ticketTypeRepository.findByIdWithLock(ticketTypeId).orElseThrow(() -> new TicketTypetNotFoundException(
            String.format("Ticket type with ID %s not found", ticketTypeId)
        ));
 
        int purchasedTickets = ticketRepository.countByTicketTypeId(ticketTypeId);

        Integer totalAvailable = ticketType.getTotalAvailable();

        if (purchasedTickets + 1 > totalAvailable) {
            throw new TicketsSoldOutException();
        }

        Ticket ticket = new Ticket();
        ticket.setStatus(TicketStatusEnum.PURCHASED);
        ticket.setTicketType(ticketType);
        ticket.setPurchaser(user);

        Ticket savedTicket = ticketRepository.save(ticket);

        qrCodeService.generateQrCode(savedTicket);
    
        return ticketRepository.save(savedTicket);
    }
}

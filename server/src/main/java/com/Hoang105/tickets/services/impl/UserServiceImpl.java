package com.Hoang105.tickets.services.impl;

import com.Hoang105.tickets.domain.entities.Ticket;
import com.Hoang105.tickets.domain.entities.User;
import com.Hoang105.tickets.domain.entities.UserRoleEnum;
import com.Hoang105.tickets.repositories.TicketRepository;
import com.Hoang105.tickets.repositories.UserRepository;
import com.Hoang105.tickets.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;

    @Override
    public Page<User> listAttendees(Pageable pageable) {
        return userRepository.findAllByRole(UserRoleEnum.ATTENDEE, pageable);
    }

    @Override
    public Integer countTotalTickets(UUID id) {
        return ticketRepository.countByPurchaserId(id);
    }

    @Override
    public LocalDateTime lastPurchaseDate(UUID id) {
        return ticketRepository.findFirstByPurchaserIdOrderByCreatedAtDesc(id)
                .map(Ticket::getCreatedAt)
                .orElse(null);
    }


}

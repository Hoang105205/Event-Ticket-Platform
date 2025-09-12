package com.Hoang105.tickets.services.impl;

import com.Hoang105.tickets.domain.entities.Ticket;
import com.Hoang105.tickets.domain.entities.User;
import com.Hoang105.tickets.domain.entities.enums.UserRoleEnum;
import com.Hoang105.tickets.exceptions.UserNotFoundException;
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

    @Override
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(UserNotFoundException::new);
    }

    @Override
    public int countTotalAttendees() {
        return userRepository.countByRole(UserRoleEnum.ATTENDEE);
    }

    @Override
    public int countNewAttendeesThisWeek() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        return (int) userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRoleEnum.ATTENDEE)
                .filter(user -> user.getCreatedAt().isAfter(oneWeekAgo))
                .count();
    };

    @Override
    public int countNewAttendeesThisMonth() {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
        return (int) userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRoleEnum.ATTENDEE)
                .filter(user -> user.getCreatedAt().isAfter(oneMonthAgo))
                .count();
    }


}

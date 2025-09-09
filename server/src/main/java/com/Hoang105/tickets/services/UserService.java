package com.Hoang105.tickets.services;


import com.Hoang105.tickets.domain.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.UUID;

public interface UserService {
    Page<User> listAttendees(Pageable pageable);

    Integer countTotalTickets(UUID id);

    LocalDateTime lastPurchaseDate(UUID id);

}

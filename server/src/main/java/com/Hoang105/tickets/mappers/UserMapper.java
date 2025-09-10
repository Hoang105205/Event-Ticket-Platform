package com.Hoang105.tickets.mappers;

import com.Hoang105.tickets.domain.dtos.Administrator.GetAttendeeDetailsResponseDto;
import com.Hoang105.tickets.domain.dtos.Administrator.ListAttendeesResponseDto;
import com.Hoang105.tickets.domain.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.time.LocalDateTime;

@Mapper(componentModel = "spring", uses = TicketMapper.class, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    ListAttendeesResponseDto toListAttendeesResponseDto(User user, Integer totalTickets, LocalDateTime lastPurchaseDate);

    GetAttendeeDetailsResponseDto toGetAttendeeDetailsResponseDto(User user, Integer totalTickets, LocalDateTime lastPurchaseDate);
}

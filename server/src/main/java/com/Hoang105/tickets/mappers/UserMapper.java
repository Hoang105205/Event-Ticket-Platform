package com.Hoang105.tickets.mappers;

import com.Hoang105.tickets.domain.dtos.ListAttendeesResponseDto;
import com.Hoang105.tickets.domain.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.time.LocalDateTime;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    ListAttendeesResponseDto toListAttendeesResponseDto(User user, Integer totalTickets, LocalDateTime lastPurchaseDate);
}

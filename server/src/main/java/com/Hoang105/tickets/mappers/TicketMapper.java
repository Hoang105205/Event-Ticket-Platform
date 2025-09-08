package com.Hoang105.tickets.mappers;

import org.mapstruct.*;

import com.Hoang105.tickets.domain.dtos.GetTicketResponseDto;
import com.Hoang105.tickets.domain.dtos.ListTicketResponseDto;
import com.Hoang105.tickets.domain.dtos.ListTicketTicketTypeResponseDto;
import com.Hoang105.tickets.domain.entities.Ticket;
import com.Hoang105.tickets.domain.entities.TicketType;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TicketMapper {

    ListTicketTicketTypeResponseDto toListTicketTicketTypeResponseDto(TicketType ticketType);

    ListTicketResponseDto toListTicketResponseDto(Ticket ticket);

    @Mapping(target = "price", source = "ticket.ticketType.price")
    @Mapping(target = "description", source = "ticket.ticketType.description")
    @Mapping(target = "eventName", source = "ticket.ticketType.event.name")
    @Mapping(target = "eventVenue", source = "ticket.ticketType.event.venue")
    @Mapping(target = "eventStart", source = "ticket.ticketType.event.start")
    @Mapping(target = "eventEnd", source = "ticket.ticketType.event.end")
    GetTicketResponseDto toGetTicketResponseDto(Ticket ticket);

}

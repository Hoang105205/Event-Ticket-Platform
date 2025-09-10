package com.Hoang105.tickets.mappers;

import com.Hoang105.tickets.domain.dtos.Administrator.ListAttendeeTicketResponseDto;
import org.mapstruct.*;

import com.Hoang105.tickets.domain.dtos.Attendee.GetTicketResponseDto;
import com.Hoang105.tickets.domain.dtos.Attendee.ListTicketResponseDto;
import com.Hoang105.tickets.domain.dtos.Attendee.ListTicketTicketTypeResponseDto;
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


    @Mapping(target = "ticketType_name", source = "ticket.ticketType.name")
    @Mapping(target = "ticketType_price", source = "ticket.ticketType.price")
    @Mapping(target = "ticketType_description", source = "ticket.ticketType.description")
    @Mapping(target = "ticketType_event_start", source = "ticket.ticketType.event.start")
    @Mapping(target = "ticketType_event_end", source = "ticket.ticketType.event.end")
    @Mapping(target = "ticketType_event_name", source = "ticket.ticketType.event.name")
    @Mapping(target = "ticketType_event_venue", source = "ticket.ticketType.event.venue")
    ListAttendeeTicketResponseDto toListAttendeeTicketDto(Ticket ticket);
}

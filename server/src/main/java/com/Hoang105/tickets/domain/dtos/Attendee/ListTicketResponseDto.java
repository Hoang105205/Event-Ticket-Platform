package com.Hoang105.tickets.domain.dtos.Attendee;

import java.util.UUID;

import com.Hoang105.tickets.domain.entities.enums.TicketStatusEnum;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListTicketResponseDto {
    private UUID id;
    private TicketStatusEnum status;
    private ListTicketTicketTypeResponseDto ticketType;
}

package com.Hoang105.tickets.domain.dtos;

import java.util.UUID;

import com.Hoang105.tickets.domain.entities.TicketStatusEnum;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListTicketResponseDto {
    private UUID id;
    private TicketStatusEnum status;
    private ListTicketTicketTypeResponseDto ticketType;
}

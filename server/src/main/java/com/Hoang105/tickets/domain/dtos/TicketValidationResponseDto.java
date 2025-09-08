package com.Hoang105.tickets.domain.dtos;

import com.Hoang105.tickets.domain.entities.TicketValidationEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketValidationResponseDto {
    private UUID ticketId;
    private TicketValidationEnum status;
}

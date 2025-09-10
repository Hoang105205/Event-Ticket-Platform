package com.Hoang105.tickets.domain.dtos.Administrator;

import com.Hoang105.tickets.domain.entities.enums.TicketStatusEnum;
import com.Hoang105.tickets.domain.entities.TicketType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListAttendeeTicketResponseDto {
    private UUID id;
    private TicketStatusEnum status;
    private LocalDateTime createdAt;
    private String ticketType_name;
    private Double ticketType_price;
    private String ticketType_description;
    private LocalDateTime ticketType_event_start;
    private LocalDateTime ticketType_event_end;
    private String ticketType_event_name;
    private String ticketType_event_venue;
}

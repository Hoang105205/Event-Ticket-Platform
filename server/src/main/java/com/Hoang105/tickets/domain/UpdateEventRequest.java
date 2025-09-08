package com.Hoang105.tickets.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.Hoang105.tickets.domain.entities.*;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEventRequest {
    private UUID id;

    private String name;
    private LocalDateTime start;
    private LocalDateTime end;
    private String venue;
    private LocalDateTime salesStart;
    private LocalDateTime salesEnd;
    private EventStatusEnum status;

    private List<UpdateTicketTypeRequest> ticketTypes = new ArrayList<>();
}

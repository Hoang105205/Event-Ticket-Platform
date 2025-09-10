package com.Hoang105.tickets.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.Hoang105.tickets.domain.entities.enums.EventStatusEnum;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateEventRequest {
    private String name;
    private LocalDateTime start;
    private LocalDateTime end;
    private String venue;
    private LocalDateTime salesStart;
    private LocalDateTime salesEnd;
    private EventStatusEnum status;

    private List<CreateTicketTypeRequest> ticketTypes = new ArrayList<>();
}

package com.Hoang105.tickets.domain.dtos.Administrator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListAttendeesResponseDto {
    private UUID id;
    private String name;
    private String email;
    private Integer totalTickets;
    private LocalDateTime lastPurchaseDate;
}

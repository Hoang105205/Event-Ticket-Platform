package com.Hoang105.tickets.domain.dtos;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetPublishedEventDetailsTicketTypeResponseDto {
    private UUID id;
    private String name;
    private Double price;
    private String description;
}

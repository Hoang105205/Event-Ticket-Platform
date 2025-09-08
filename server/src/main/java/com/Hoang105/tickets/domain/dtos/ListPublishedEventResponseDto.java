package com.Hoang105.tickets.domain.dtos;


import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListPublishedEventResponseDto {
    private String id;
    private String name;
    private LocalDateTime start;
    private LocalDateTime end;
    private String venue;
}

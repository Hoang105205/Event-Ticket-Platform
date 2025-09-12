package com.Hoang105.tickets.domain.dtos.Administrator;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlatformStatisticsResponseDto {
    private int totalAttendees;
    private int totalEvents;
    private int publishedEvents;
    private int draftEvents;
    private int totalTicketsSold;
    private int totalTicketsRemaining;
    private int newAttendeesThisWeek;
    private int newAttendeesThisMonth;
}

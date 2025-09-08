package com.Hoang105.tickets.services;

import java.util.UUID;

import com.Hoang105.tickets.domain.entities.QrCode;
import com.Hoang105.tickets.domain.entities.Ticket;

public interface QrCodeService {
    QrCode generateQrCode(Ticket ticket);

    byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId);
}

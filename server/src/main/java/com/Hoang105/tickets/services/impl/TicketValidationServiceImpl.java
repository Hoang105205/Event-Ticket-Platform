package com.Hoang105.tickets.services.impl;

import com.Hoang105.tickets.domain.entities.*;
import com.Hoang105.tickets.exceptions.QrCodeNotFoundException;
import com.Hoang105.tickets.exceptions.TicketNotFoundException;
import com.Hoang105.tickets.repositories.QrCodeRepository;
import com.Hoang105.tickets.repositories.TicketRepository;
import com.Hoang105.tickets.repositories.TicketValidationRepository;
import com.Hoang105.tickets.services.TicketValidationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;


@Service
@RequiredArgsConstructor
@Transactional
public class TicketValidationServiceImpl implements  TicketValidationService {

    private final TicketValidationRepository ticketValidationRepository;
    private final QrCodeRepository qrCodeRepository;
    private final TicketRepository ticketRepository;


    @Override
    public TicketValidation validateTicketByQrCode(UUID qrCodeId) {
        QrCode qrCode = qrCodeRepository.findByIdAndStatus(qrCodeId, QrCodeStatusEnum.ACTIVE)
                .orElseThrow(() -> new QrCodeNotFoundException(
                        String.format("QR Code with ID %s not found", qrCodeId)
                ));

        Ticket ticket = qrCode.getTicket();

        return validate(ticket, TicketValidationMethodEnum.QR_SCAN);
    }

    private TicketValidation validate(Ticket ticket, TicketValidationMethodEnum method) {
        TicketValidation ticketValidation = new TicketValidation();

        ticketValidation.setTicket(ticket);
        ticketValidation.setValidationMethod(method);

        TicketValidationEnum ticketValidationStatus = ticket.getValidations().stream()
                .filter(v -> TicketValidationEnum.VALID.equals(v.getStatus()))
                .findFirst()
                .map(v -> TicketValidationEnum.INVALID)
                .orElse(TicketValidationEnum.VALID);

        ticketValidation.setStatus(ticketValidationStatus);

        return ticketValidationRepository.save(ticketValidation);
    }

    @Override
    public TicketValidation validateTicketManually(UUID ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(TicketNotFoundException::new);

        return validate(ticket, TicketValidationMethodEnum.MANUAL);
    }
}

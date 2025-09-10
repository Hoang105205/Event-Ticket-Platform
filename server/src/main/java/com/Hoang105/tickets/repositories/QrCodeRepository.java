package com.Hoang105.tickets.repositories;

import java.util.Optional;
import java.util.UUID;

import com.Hoang105.tickets.domain.entities.enums.QrCodeStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Hoang105.tickets.domain.entities.QrCode;

@Repository
public interface QrCodeRepository extends JpaRepository<QrCode, UUID> {

    Optional<QrCode> findByTicketIdAndTicketPurchaserId(UUID ticketId, UUID purchaserId);

    Optional<QrCode> findByIdAndStatus(UUID id, QrCodeStatusEnum status);

}

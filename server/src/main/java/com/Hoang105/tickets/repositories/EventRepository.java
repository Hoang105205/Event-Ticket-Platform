package com.Hoang105.tickets.repositories;

import com.Hoang105.tickets.domain.entities.Event;
import com.Hoang105.tickets.domain.entities.enums.EventStatusEnum;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    Page<Event> findByOrganizerId(UUID organizerId, Pageable pageable);

    Optional<Event> findByIdAndOrganizerId(UUID id, UUID organizerId);

    Page<Event> findByStatus(EventStatusEnum status, Pageable pageable);

    
    @Query(value = "SELECT * FROM events WHERE " +
        "status = 'PUBLISHED' AND " +
        "(to_tsvector('english', COALESCE(name, '')) || " +
        "to_tsvector('english', COALESCE(venue, ''))) @@ " +
        "plainto_tsquery('english', :searchTerm)",
       countQuery = "SELECT count(*) FROM events WHERE " +
        "status = 'PUBLISHED' AND " +
        "(to_tsvector('english', COALESCE(name, '')) || " +
        "to_tsvector('english', COALESCE(venue, ''))) @@ " +
        "plainto_tsquery('english', :searchTerm)",
       nativeQuery = true)
    Page<Event> searchEvents(@Param("searchTerm") String searchTerm, Pageable pageable);


    Optional<Event> findByIdAndStatus(UUID id, EventStatusEnum status);
}

package com.Hoang105.tickets.repositories;

import java.util.UUID;

import com.Hoang105.tickets.domain.entities.enums.UserRoleEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Hoang105.tickets.domain.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Page<User> findAllByRole(UserRoleEnum role, Pageable pageable);

}

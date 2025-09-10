package com.Hoang105.tickets.filters;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.Hoang105.tickets.domain.entities.enums.UserRoleEnum;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.Hoang105.tickets.domain.entities.User;
import com.Hoang105.tickets.repositories.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component 
@RequiredArgsConstructor
public class UserProvisioningFilter extends OncePerRequestFilter{

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, 
            HttpServletResponse response, 
            FilterChain filterChain) throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof Jwt jwt) {
            UUID keycloakId = UUID.fromString(jwt.getSubject());


            if (userRepository.existsById(keycloakId)) {

                User existingUser = userRepository.findById(keycloakId).orElse(null);
                if (existingUser != null && existingUser.getRole() == null) {
                    existingUser.setRole(determineUserRole(jwt));
                    userRepository.save(existingUser);
                }

            } else {

                User user = new User();
                user.setId(keycloakId);
                user.setName(jwt.getClaimAsString("preferred_username"));
                user.setEmail(jwt.getClaimAsString("email"));
                user.setRole(determineUserRole(jwt));

                userRepository.save(user);
            }
        }

        filterChain.doFilter(request, response);
    }

    private UserRoleEnum determineUserRole(Jwt jwt) {
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");

        if (realmAccess == null) {
            return UserRoleEnum.ATTENDEE;
        }

        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) realmAccess.get("roles");

        if (roles == null || roles.isEmpty()) {
            return UserRoleEnum.ATTENDEE;
        }

        // Kiểm tra theo thứ tự ưu tiên: Administrator -> Organizer -> Staff -> Attendee
        if (roles.contains("ROLE_ADMINISTRATOR")) {
            return UserRoleEnum.ADMINISTRATOR;
        } else if (roles.contains("ROLE_ORGANIZER")) {
            return UserRoleEnum.ORGANIZER;
        } else if (roles.contains("ROLE_STAFF")) {
            return UserRoleEnum.STAFF;
        } else {
            return UserRoleEnum.ATTENDEE;
        }
    }
}

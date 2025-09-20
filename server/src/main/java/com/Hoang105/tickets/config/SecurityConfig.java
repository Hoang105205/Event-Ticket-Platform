package com.Hoang105.tickets.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.Hoang105.tickets.filters.UserProvisioningFilter;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${app.frontend.origin}") String frontendOrigin) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(frontendOrigin));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // Nếu dùng cookie

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }


    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http, 
            UserProvisioningFilter userProvisioningFilter,
            JwtAuthenticationConverter jwtAuthenticationConverter,
            CorsConfigurationSource corsConfigurationSource) throws Exception{

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .authorizeHttpRequests(authorize ->
                authorize
                    .requestMatchers(HttpMethod.GET, "/api/v1/published-events/**").permitAll()
                    .requestMatchers(
                            "/v3/api-docs/**",
                            "/swagger-ui/**",
                            "/swagger-ui.html"
                    ).permitAll()
                    .requestMatchers("/api/v1/users/**").hasRole("ADMINISTRATOR")
                    .requestMatchers("/api/v1/admin/**").hasRole("ADMINISTRATOR")
                    .requestMatchers("/api/v1/events").hasRole("ORGANIZER")
                    .requestMatchers("/api/v1/ticket-validations").hasRole("STAFF")
                    .anyRequest().authenticated())


            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .oauth2ResourceServer(oauth2 ->
                    oauth2.jwt(jwt -> 
                        jwt.jwtAuthenticationConverter(jwtAuthenticationConverter)
                    ))
            .addFilterAfter(userProvisioningFilter, BearerTokenAuthenticationFilter.class);

        return http.build();
    } 
}

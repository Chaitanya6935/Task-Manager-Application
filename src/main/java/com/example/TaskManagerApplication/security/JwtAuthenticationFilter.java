package com.example.TaskManagerApplication.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService,
                                   CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // 1. No header or not "Bearer ..." → skip, let the chain continue unauthenticated
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Extract the token (everything after "Bearer ")
        final String jwt = authHeader.substring(7);

        try {
            // 3. Extract username from the token
            final String username = jwtService.extractUsername(jwt);

            // 4. Only proceed if we got a username and no auth exists yet
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // 5. Load user from DB
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // 6. Validate token against the loaded user
                if (jwtService.isTokenValid(jwt, userDetails)) {

                    // 7. Build an authentication object
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,                               // credentials — null after auth
                                    userDetails.getAuthorities()
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    // 8. Store it in the SecurityContext — request is now authenticated
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception ex) {
            // Invalid/expired/malformed token → log and continue unauthenticated
            // The EntryPoint will handle the 401 if the endpoint requires auth
            logger.warn("JWT validation failed: " + ex.getMessage());
        }

        // 9. Always continue the chain
        filterChain.doFilter(request, response);
    }
}
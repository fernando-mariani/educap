package io.fermedley.com.Educap.security;

import io.fermedley.com.Educap.security.entity.UsuarioEntity;
import io.fermedley.com.Educap.security.service.UsuarioService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JWTAuthenticationFilterCustom extends OncePerRequestFilter {

    private final UsuarioService usuarioService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(isJwt(authentication)) {
            String login = authentication.getName();
            UsuarioEntity usuario = usuarioService.obterPorEmail(login);

            if(usuario != null) {
                authentication = new AuthenticationCustom(usuario);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isJwt(Authentication auth) {
        return auth != null && auth instanceof JwtAuthenticationToken;
    }
}

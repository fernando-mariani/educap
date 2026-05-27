package io.fermedley.com.Educap.security.service;

import io.fermedley.com.Educap.security.AuthenticationCustom;
import io.fermedley.com.Educap.security.entity.UsuarioEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityService {

    private final UsuarioService usuarioService;

    public UsuarioEntity obterUsuarioLogado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication instanceof AuthenticationCustom authenticationCustom) {
            return authenticationCustom.getUsuario();
        }

        return null;
    }
}

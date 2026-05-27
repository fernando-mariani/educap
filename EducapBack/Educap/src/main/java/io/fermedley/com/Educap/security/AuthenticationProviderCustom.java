package io.fermedley.com.Educap.security;

import io.fermedley.com.Educap.exceptions.NotVerifiedUserException;
import io.fermedley.com.Educap.security.entity.UsuarioEntity;
import io.fermedley.com.Educap.security.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthenticationProviderCustom implements AuthenticationProvider {

    private final UsuarioService service;
    private final PasswordEncoder encoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String email = authentication.getName();
        String senhaDigitada = authentication.getCredentials().toString();

        UsuarioEntity usuarioEncontrado = service.obterPorEmail(email);

        if(usuarioEncontrado == null) {
            throw new UsernameNotFoundException("Email e/ou senha incorretos!");
        }

        if(!usuarioEncontrado.isVerified()) {
            throw new NotVerifiedUserException("Usuario nao verificado!");
        }

        String senhaCript = usuarioEncontrado.getSenha();

        boolean isSenhasMatching = encoder.matches(senhaDigitada, senhaCript);

        if(isSenhasMatching) {
            return new AuthenticationCustom(usuarioEncontrado);
        }

        throw new UsernameNotFoundException("Email e/ou senha incorretos!");
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.isAssignableFrom(UsernamePasswordAuthenticationToken.class);
    }
}

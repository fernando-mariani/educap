package io.fermedley.com.Educap.security;

import io.fermedley.com.Educap.security.entity.UsuarioEntity;
import io.fermedley.com.Educap.security.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@RequiredArgsConstructor
public class UserDetailsServiceCustom implements UserDetailsService {

    private final UsuarioService service;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UsuarioEntity usuario = service.obterPorEmail(email);

        if(usuario == null) {
            throw new UsernameNotFoundException("Usuario nao encontrado");
        }

        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getSenha())
                .roles(usuario.getRole())
                .build();
    }
}

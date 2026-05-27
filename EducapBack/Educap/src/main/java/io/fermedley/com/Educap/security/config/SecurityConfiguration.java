package io.fermedley.com.Educap.security.config;

import io.fermedley.com.Educap.security.JWTAuthenticationFilterCustom;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
public class SecurityConfiguration {


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JWTAuthenticationFilterCustom jwtAuthenticationFilterCustom) throws Exception{
        return http
                .csrf(AbstractHttpConfigurer:: disable)
                .httpBasic(Customizer.withDefaults())
                .formLogin(config -> {
                    config.loginPage("/login");
                })
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/login/**").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/usuarios/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/role-key/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/turmas/**").permitAll();
                    auth.anyRequest().authenticated();
                })
                .exceptionHandling(ex -> {
                    ex.
                            accessDeniedHandler(((request, response, accessDeniedException) -> {
                            response.setStatus(403);
                            response.setContentType("application/json");
                            response.getWriter().write("""
                                {
                                    "error": "Forbidden",
                                    "menssage,": "Você não tem permissão para acessar este recurso"
                                }
                                """);
                            }));
                })
                .oauth2ResourceServer(auth2 -> auth2.jwt(Customizer.withDefaults()))
                .addFilterAfter(jwtAuthenticationFilterCustom, BearerTokenAuthenticationFilter.class)
                .build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web ->
            web.ignoring().requestMatchers(
                    "/v2/api-docs/**",
                    "/v3/api-docs/**",
                    "/swagger-resources/**",
                    "/swagger-ui.html",
                    "/swagger-ui/**",
                    "/webjar/**"
            );
    }

    @Bean
    public GrantedAuthorityDefaults grantedAuthorityDefaults() {
        return new GrantedAuthorityDefaults("");
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        var authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthoritiesClaimName("role");
        authoritiesConverter.setAuthorityPrefix("");

        var converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);

        return converter;
    }
}

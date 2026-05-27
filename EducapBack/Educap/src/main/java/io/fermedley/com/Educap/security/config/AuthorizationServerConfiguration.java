package io.fermedley.com.Educap.security.config;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import io.fermedley.com.Educap.exceptions.UsuarioValidoException;
import io.fermedley.com.Educap.security.AuthenticationCustom;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configuration.OAuth2AuthorizationServerConfiguration;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configurers.OAuth2AuthorizationServerConfigurer;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.OAuth2TokenFormat;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;
import org.springframework.security.oauth2.server.authorization.token.JwtEncodingContext;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenCustomizer;
import org.springframework.security.web.SecurityFilterChain;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Configuration
@EnableWebSecurity
public class AuthorizationServerConfiguration {

    @Bean
    @Order(1)
    public SecurityFilterChain OAuth2SecurityFilterChain(HttpSecurity http) throws Exception {

        OAuth2AuthorizationServerConfiguration.applyDefaultSecurity(http);
        http.getConfigurer(OAuth2AuthorizationServerConfigurer.class)
                        .oidc(Customizer.withDefaults());

        http.oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        http.formLogin(config -> config.loginPage("/login"));
        http.logout(logout -> {
            logout.logoutUrl("/logout")
                    .logoutSuccessHandler((request, response, authentication) -> {
                        response.setStatus(HttpServletResponse.SC_OK);
                    })
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID");
        });
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public TokenSettings tokenSettings() {
        return TokenSettings.builder()
                .accessTokenFormat(OAuth2TokenFormat.SELF_CONTAINED)
                .accessTokenTimeToLive(Duration.ofDays(30))
                .build();
    }

    @Bean
    public ClientSettings clientSettings() {
        return ClientSettings.builder()
                .requireAuthorizationConsent(false)
                .build();
    }

    @Bean
    public JWKSource<SecurityContext> jwkSource() throws Exception{
        RSAKey rsaKey = gerarRSA();
        JWKSet jwkSet = new JWKSet(rsaKey);

        return new ImmutableJWKSet<>(jwkSet);
    }

    private RSAKey gerarRSA() throws Exception{
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(2048);

        KeyPair keyPair = keyPairGenerator.generateKeyPair();

        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();

        return new RSAKey.Builder(publicKey).privateKey(privateKey).keyID(UUID.randomUUID().toString()).build();
    }

    @Bean
    public JwtDecoder jwtDecoder(JWKSource<SecurityContext> jwkSource) {
        return OAuth2AuthorizationServerConfiguration.jwtDecoder(jwkSource);
    }

    @Bean
    public OAuth2TokenCustomizer<JwtEncodingContext> tokenCustomizer() throws Exception{
        return context ->{
            var principal = context.getPrincipal();

            if(principal instanceof AuthenticationCustom authenticationCustom) {
                OAuth2TokenType tokenType = context.getTokenType();

                if(OAuth2TokenType.ACCESS_TOKEN.equals(tokenType)) {
                    Collection<? extends GrantedAuthority> authorities = authenticationCustom.getAuthorities();
                    List<String> authoritiesList = authorities.stream().map(GrantedAuthority::getAuthority).toList();

                    if(authenticationCustom.getUsuario().getAluno() != null) {
                        context.getClaims()
                                .claim("role", authoritiesList)
                                .claim("aluno", authenticationCustom.getUsuario().getAluno().getId());
                        return;
                    }

                    if(authenticationCustom.getUsuario().getProfessor() != null) {
                        context.getClaims()
                                .claim("role", authoritiesList)
                                .claim("professor", authenticationCustom.getUsuario().getProfessor().getId());
                        return;
                    }
                    if(authenticationCustom.getUsuario().getDiretor() != null) {
                        context.getClaims()
                                .claim("role", authoritiesList)
                                .claim("diretor", authenticationCustom.getUsuario().getDiretor().getId());
                        return;
                    }
                    throw new UsuarioValidoException("Usuário inválido, verifique os dados ou chame o suporte!");
                }
            }
        };
    }
}

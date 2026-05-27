package io.fermedley.com.Educap.security.dto;

import jakarta.validation.constraints.NotBlank;

public record ClientDTO(
        @NotBlank(message = "Campo obrigatório")
        String clientId,
        @NotBlank(message = "Campo obrigatório")
        String clientSecret,
        @NotBlank(message = "Campo obrigatório")
        String redirectUri,
        @NotBlank(message = "Campo obrigatório")
        String scope
) {
}

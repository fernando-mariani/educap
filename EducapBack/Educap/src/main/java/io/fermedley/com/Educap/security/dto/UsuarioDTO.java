package io.fermedley.com.Educap.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record UsuarioDTO(
        @NotBlank(message = "Campo Obrigatório")
        String key,
        @NotBlank(message = "Campo Obrigatório")
        @Email
        String email,
        @NotBlank(message = "Campo Obrigatório")
        String senha
) {
}

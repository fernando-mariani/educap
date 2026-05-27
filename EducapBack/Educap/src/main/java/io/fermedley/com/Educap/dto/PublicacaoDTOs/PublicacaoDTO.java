package io.fermedley.com.Educap.dto.PublicacaoDTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PublicacaoDTO(
        @NotBlank(message = "Campo obrigatório")
        String titulo,
        @NotBlank(message = "Campo obrigatório")
        String descricao,
        @NotNull(message = "Campo obrigatório")
        UUID idDiretor
) {
}

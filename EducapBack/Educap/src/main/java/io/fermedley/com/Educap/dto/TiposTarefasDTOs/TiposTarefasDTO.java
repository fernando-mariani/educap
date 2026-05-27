package io.fermedley.com.Educap.dto.TiposTarefasDTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TiposTarefasDTO(
        @NotBlank(message = "Campo Obrigatório!")
        String tipo,
        @NotNull(message = "Campo Obrigatório!")
        Double notaMax
) {
}

package io.fermedley.com.Educap.dto.TurmaDTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TurmaDTO(
        @NotBlank(message = "Campo Obrigatório!")
        String nomeTurma
) {

}

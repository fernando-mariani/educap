package io.fermedley.com.Educap.dto.ProfessorDTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record ProfessorDTO(
        @NotBlank(message = "Campo Obrigatório!")
        String nome,
        @NotBlank(message = "Campo Obrigatório!")
        String materia,
        @NotNull(message = "Campo Obrigatório!")
        Iterable<UUID> idTurmas
) {
}

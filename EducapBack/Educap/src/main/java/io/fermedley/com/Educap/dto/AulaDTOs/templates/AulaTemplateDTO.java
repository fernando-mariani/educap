package io.fermedley.com.Educap.dto.AulaDTOs.templates;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AulaTemplateDTO(
        @NotBlank(message = "Campo Obrigatório")
        String cor,
        @NotNull(message = "Campo Obrigatório")
        @Min(0)
        Integer duracao,
        @NotNull(message = "Campo Obrigatório")
        UUID idProfessor,
        @NotNull(message = "Campo Obrigatório")
        Iterable<UUID> idTurmas
) {
}

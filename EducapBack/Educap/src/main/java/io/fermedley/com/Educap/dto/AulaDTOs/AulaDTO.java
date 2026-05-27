package io.fermedley.com.Educap.dto.AulaDTOs;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AulaDTO(
        @NotBlank(message = "Campo Obrigatório")
        String nome,
        @NotNull(message = "Campo Obrigatório")
        Integer horarioInicio,
        @NotNull(message = "Campo Obrigatório")
        Integer horarioFim,
        @NotNull(message = "Campo Obrigatório")
        Integer diaSemana,
        @NotNull(message = "Campo Obrigatório")
        UUID idProfessor,
        @NotNull(message = "Campo Obrigatório")
        UUID idTurma
) {
}

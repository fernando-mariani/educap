package io.fermedley.com.Educap.dto.AulaDTOs;

import java.util.UUID;

public record AulaResponseDTO(
        UUID id,
        String nome,
        Integer horarioInicio,
        Integer horarioFim,
        Integer diaSemana,
        AulaResponsePRODTO professor,
        AulaResponseTURDTO turma
) {
}

package io.fermedley.com.Educap.dto.TurmaDTOs;

import java.util.UUID;

public record TurmaCommonResponse(
        UUID id,
        String nomeTurma,
        Number numAlunos,
        Number numProfessores
) {
}

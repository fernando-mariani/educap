package io.fermedley.com.Educap.dto.TurmaDTOs;

import java.util.List;
import java.util.UUID;

public record TurmaResponseDTO(
        UUID id,
        String nomeTurma,
        List<TurmaResponsePROFDTO> professores,
        List<TurmaResponseALUDTO> alunos,
        List<TurmaResponseAULDTO> aulas,
        List<TurmaResponseTARDTO> tarefas
) {
}

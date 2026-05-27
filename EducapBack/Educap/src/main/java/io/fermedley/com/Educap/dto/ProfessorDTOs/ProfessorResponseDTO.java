package io.fermedley.com.Educap.dto.ProfessorDTOs;

import java.util.List;
import java.util.UUID;

public record ProfessorResponseDTO(
        UUID id,
        String nome,
        String materia,
        List<ProfessorResponseTURDTO> turmas
) {
}

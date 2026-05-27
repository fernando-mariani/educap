package io.fermedley.com.Educap.dto.TurmaDTOs;

import java.util.UUID;

public record TurmaResponsePROFDTO(
        UUID id,
        String nome,
        String materia
) {
}

package io.fermedley.com.Educap.dto.AulaDTOs;

import java.util.UUID;

public record AulaResponsePRODTO(
        UUID id,
        String nome,
        String materia
) {
}

package io.fermedley.com.Educap.dto.AulaDTOs.templates;

import java.util.UUID;

public record AulaTemplatePRO(
        UUID id,
        String nome,
        String materia
) {
}

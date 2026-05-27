package io.fermedley.com.Educap.dto.AulaDTOs.templates;

import java.util.List;
import java.util.UUID;

public record AulaTemplateResponse(
        UUID id,
        String cor,
        Integer duracao,
        AulaTemplatePRO professor,
        List<AulaTemplateTUR> turmas
) {
}

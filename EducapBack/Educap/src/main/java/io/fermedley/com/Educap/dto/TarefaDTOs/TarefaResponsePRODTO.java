package io.fermedley.com.Educap.dto.TarefaDTOs;

import java.util.UUID;

public record TarefaResponsePRODTO(
        UUID id,
        String nome,
        String materia
) {
}

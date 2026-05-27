package io.fermedley.com.Educap.dto.TarefaDTOs;

import java.util.UUID;

public record TarefaResponseTIPDTO(
        UUID id,
        String tipo,
        Double notaMax
) {
}

package io.fermedley.com.Educap.dto.TiposTarefasDTOs;

import java.util.UUID;

public record TiposTarefasResponseDTO(
        UUID id,
        String tipo,
        Double notaMax
) {
}

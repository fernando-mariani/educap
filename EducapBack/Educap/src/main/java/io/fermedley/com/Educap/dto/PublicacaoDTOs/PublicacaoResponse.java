package io.fermedley.com.Educap.dto.PublicacaoDTOs;

import java.sql.Timestamp;
import java.util.UUID;

public record PublicacaoResponse(
        UUID id,
        String titulo,
        String descricao,
        PublicacaoDirResponse diretor,
        Timestamp dataRegistro
) {
}

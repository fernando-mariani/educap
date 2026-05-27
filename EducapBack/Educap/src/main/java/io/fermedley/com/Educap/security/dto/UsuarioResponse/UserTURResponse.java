package io.fermedley.com.Educap.security.dto.UsuarioResponse;

import java.util.UUID;

public record UserTURResponse(
        UUID id,
        String nomeTurma
) {
}

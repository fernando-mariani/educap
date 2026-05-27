package io.fermedley.com.Educap.security.dto.UsuarioResponse;

import java.util.UUID;

public record UserALUResponse(
        UUID id,
        String nome,
        UserTURResponse turma
) {
}

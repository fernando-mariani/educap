package io.fermedley.com.Educap.security.dto.UsuarioResponse;

import java.util.UUID;

public record UserPROResponse(
        UUID id,
        String nome,
        String materia,
        UserTURResponse[] turmas
) {
}

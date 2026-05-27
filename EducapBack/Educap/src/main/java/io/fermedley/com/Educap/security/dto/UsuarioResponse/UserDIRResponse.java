package io.fermedley.com.Educap.security.dto.UsuarioResponse;

import java.util.UUID;

public record UserDIRResponse(
        UUID id,
        String nome
) {
}

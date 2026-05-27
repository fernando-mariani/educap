package io.fermedley.com.Educap.security.dto.UsuarioResponse;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        UserALUResponse aluno,
        UserPROResponse professor,
        UserDIRResponse diretor
) {
}

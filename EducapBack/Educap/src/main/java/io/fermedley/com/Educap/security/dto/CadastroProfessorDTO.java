package io.fermedley.com.Educap.security.dto;

import io.fermedley.com.Educap.dto.ProfessorDTOs.ProfessorDTO;
import jakarta.validation.Valid;

public record CadastroProfessorDTO(
        @Valid UsuarioDTO usuario,
        @Valid ProfessorDTO professor
) {
}

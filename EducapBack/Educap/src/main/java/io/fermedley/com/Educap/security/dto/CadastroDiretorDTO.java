package io.fermedley.com.Educap.security.dto;

import io.fermedley.com.Educap.dto.DiretorDTOs.DiretorDTO;
import jakarta.validation.Valid;

public record CadastroDiretorDTO(
        @Valid UsuarioDTO usuario,
        @Valid DiretorDTO diretor
        ) {
}

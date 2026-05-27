package io.fermedley.com.Educap.security.dto;

import io.fermedley.com.Educap.dto.AlunoDTOs.AlunoDTO;
import jakarta.validation.Valid;

public record CadastroAlunoDTO(
        @Valid UsuarioDTO usuario,
        @Valid AlunoDTO aluno
) {
}

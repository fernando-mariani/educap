package io.fermedley.com.Educap.dto.AlunoDTOs;

import java.time.LocalDate;
import java.util.UUID;

public record AlunoResponseDTO(
        UUID id,
        String nome,
        LocalDate dataNascimento,
        String matricula,
        AlunoResponseTURDTO turma
) {
}

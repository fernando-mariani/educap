package io.fermedley.com.Educap.dto.AlunoDTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record AlunoDTO(
        @NotBlank(message = "Campo Obrigatório!")
        String nome,
        @NotNull(message = "Campo Obrigatório!")
        LocalDate dataNascimento,
        @NotNull(message = "Campo Obrigatório!")
        UUID idTurma
) {
}
